const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const Busboy = require("busboy");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const jwt = require("jsonwebtoken");

const s3 = new S3Client({ region: process.env.AWS_REGION });

async function authenticateTokenLambda(event) {
 const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); 
    req.user = user;
    next();
  });
}

function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const busboy = new Busboy({
      headers: event.headers,
    });

    const fields = {};
    let fileData = null;
    let fileName = "";
    let fileMime = "";

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const buffers = [];
      fileName = filename;
      fileMime = mimetype;

      file.on("data", (data) => buffers.push(data));
      file.on("end", () => {
        fileData = Buffer.concat(buffers);
      });
    });

    busboy.on("field", (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on("error", reject);
    busboy.on("finish", () => {
      resolve({ fields, file: { data: fileData, filename: fileName, mimetype: fileMime } });
    });

    // event.body là base64 string, cần decode về buffer
    const bodyBuffer = Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");
    busboy.end(bodyBuffer);
  });
}

exports.handler = async (event) => {
  try {
    // 1. Authenticate
    await authenticateTokenLambda(event);

    // 2. Parse form data + file
    const { fields, file } = await parseMultipart(event);

    if (!file || !file.data) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Image file is required" }),
      };
    }

    // 3. Upload file to S3
    const ext = path.extname(file.filename);
    const key = `products/${uuidv4()}${ext}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.data,
        ContentType: file.mimetype,
      })
    );

    const imageURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    // 4. Save product to DB
    // const conn = await pool.getConnection();
    // try {
    //   await conn.beginTransaction();

    //   const [result] = await conn.execute(
    //     `INSERT INTO products (name, image_url, price, category, brand, description, created_at)
    //      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    //     [
    //       fields.name,
    //       imageURL,
    //       Number(fields.price),
    //       fields.category,
    //       fields.brand,
    //       fields.description,
    //       new Date(),
    //     ]
    //   );

    //   await conn.commit();
    //   conn.release();

    //   return {
    //     statusCode: 201,
    //     body: JSON.stringify({
    //       message: "Product created successfully",
    //       productId: result.insertId,
    //       imageURL,
    //     }),
    //   };
    // } catch (dbErr) {
    //   await conn.rollback();
    //   conn.release();
    //   console.error(dbErr);
    //   return {
    //     statusCode: 500,
    //     body: JSON.stringify({ error: "Failed to create product" }),
    //   };
    // }
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.message === "Unauthorized" ? 401 : 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
