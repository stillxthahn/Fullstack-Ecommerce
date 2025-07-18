const express = require("express");
const router = express.Router();
const db = require("../config/db");
const parseMultipart = require("../controllers/product.controller");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

router.post("/lambda", async (req, res) => {
 const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
 const Busboy = require("busboy");
 const { v4: uuidv4 } = require("uuid");
 const path = require("path");
 const mysql = require("mysql2/promise");

 // Create a pool only once per container lifecycle (cold start)

 const s3 = new S3Client({
  region: process.env.AWS_REGION,
 });
 let pool;

 async function getDatabasePool() {
  if (!pool) {
   const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
   });

   await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
   );
   await connection.end();

   pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
   });
  }
  return pool;
 }

 function parseMultipart(event) {
  return new Promise((resolve, reject) => {
   const busboy = Busboy({
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
   console.log(event.body);
   busboy.on("field", (fieldname, val) => {
    fields[fieldname] = val;
   });

   busboy.on("error", reject);
   busboy.on("finish", () => {
    resolve({
     fields,
     file: { data: fileData, filename: fileName, mimetype: fileMime },
    });
   });

   // event.body là base64 string, cần decode về buffer
   const bodyBuffer = Buffer.from(
    event.body,
    event.isBase64Encoded ? "base64" : "utf8"
   );
   busboy.end(bodyBuffer);
  });
 }

 exports.handler = async (event) => {
  try {
   // 2. Parse form data + file
   const { fields, file } = await parseMultipart(event);

   // 3. Upload file to S3
   const ext = path.extname(file.filename.filename);
   const key = `${process.env.AWS_BUCKET_PREFIX}/${uuidv4()}${ext}`;

   // return {
   //      headers: {
   //           "Access-Control-Allow-Origin": "*",
   //           "Access-Control-Allow-Headers": "*",
   //           "Access-Control-Allow-Methods": "*",
   //           "Content-Type": "application/json",
   //      },
   //      statusCode: 200,
   //      body: JSON.stringify({
   //           Bucket: process.env.AWS_BUCKET_NAME,
   //           Key: key,
   //           Body: file.data,
   //           ContentType: file.filename.mimeType,
   //      }),
   // };

   const putResult = await s3.send(
    new PutObjectCommand({
     // Bucket: process.env.AWS_BUCKET_NAME,
     // Bucket: process.env.AWS_BUCKET_NAME,
     Bucket: "d-ec-products",
     // Key: key,
     Key: `${process.env.AWS_BUCKET_PREFIX}/${uuidv4()}${ext}`,
     Body: file.data,
     ContentType: file.filename.mimeType,
    })
   );

   const imageURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

   //      // 4. Save product to DB
   //      const pool = await getDatabasePool();

   //      const conn = await pool.getConnection();
   //      try {
   //           await conn.beginTransaction();

   //           const [result] = await conn.execute(
   //                `INSERT INTO products (name, imageURL, price, category, brand, description)
   //     VALUES (?, ?, ?, ?, ?, ?)`,
   //                [
   //                     fields.name,
   //                     imageURL,
   //                     Number(fields.price),
   //                     fields.category,
   //                     fields.brand,
   //                     fields.description,
   //                ]
   //           );

   //           await conn.commit();
   //           conn.release();

   //           return {
   //                headers: {
   //                     "Access-Control-Allow-Origin": "*",
   //                     "Access-Control-Allow-Headers": "*",
   //                     "Access-Control-Allow-Methods": "*",
   //                     "Content-Type": "application/json",
   //                },
   //                statusCode: 201,
   //                body: JSON.stringify({
   //                     message: "Product created successfully",
   //                     productId: result.insertId,
   //                     imageURL,
   //                }),
   //           };
   //      } catch (dbErr) {
   //           await conn.rollback();
   //           conn.release();
   //           console.error(dbErr);
   //           return {
   //                headers: {
   //                     "Access-Control-Allow-Origin": "*",
   //                     "Access-Control-Allow-Headers": "*",
   //                     "Access-Control-Allow-Methods": "*",
   //                     "Content-Type": "application/json",
   //                },
   //                statusCode: 500,
   //                body: JSON.stringify({ error: "Failed to create product" }),
   //           };
   //      }
  } catch (err) {
   console.error(err);
   return {
    headers: {
     "Access-Control-Allow-Origin": "*",
     "Access-Control-Allow-Headers": "*",
     "Access-Control-Allow-Methods": "*",
     "Content-Type": "application/json",
    },
    statusCode: 500,
    body: JSON.stringify({ s3Response: putResult, err }),
   };
  }
 };
});

router.get("/", async (req, res) => {
 try {
  const [rows] = await db.query(
   "SELECT * FROM products ORDER BY createdAt DESC"
  );
  res.json(rows);
 } catch (error) {
  console.error("Error fetching products:", error);
  res.status(500).json({ message: "Server error" });
 }
});

router.get("/:id", async (req, res) => {
 const productId = req.params.id;
 try {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
   productId,
  ]);
  if (rows.length === 0) {
   return res.status(404).json({ message: "Product not found" });
  }
  res.json(rows[0]);
 } catch (error) {
  console.error("Error fetching product:", error);
  res.status(500).json({ message: "Server error" });
 }
});

module.exports = router;
