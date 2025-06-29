const express = require("express");
const router = express.Router();
const db = require("../config/db");
const parseMultipart = require("../controllers/product.controller");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

router.post("/lambda", async (req, res) => {
 // const s3 = new S3Client({ region: process.env.AWS_REGION });

 const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
 });

 const { fields, file } = await parseMultipart(req);
 const ext = path.extname(file.filename.filename);
 const key = `${process.env.AWS_BUCKET_PREFIX}/${uuidv4()}${ext}`;

 await s3.send(
  new PutObjectCommand({
   Bucket: process.env.AWS_BUCKET_NAME,
   Key: key,
   Body: file.data.data,
   ContentType: file.filename.mimeType,
  })
 );

 const imageURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_PREFIX}/${key}`;
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
