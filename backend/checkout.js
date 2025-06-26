require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const morgan = require("morgan");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");


app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
const pool = mysql.createPool({
 host: "localhost", // nếu cùng container thì dùng "mysql-container" hoặc "mysql" (Docker Compose)
 user: "root",
 password: "123456",
 database: "mydb",
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // token sai hoặc hết hạn
    req.user = user;
    next();
  });
};


const newArray = [];
const calculateOrderAmount = (items) => {
 items.map((item) => {
  const { price, qty } = item;
  const totalItemAmount = price * qty;
  return newArray.push(totalItemAmount);
 });
 const totalCartAmount = newArray.reduce((total, curr) => total + curr, 0);
 return totalCartAmount * 100;
};

app.post("/api/create-payment-intent", async (req, res) => {
 const { items, shippingAddress, description } = req.body;
 // Create a PaymentIntent with the order amount and currency
 const paymentIntent = await stripe.paymentIntents.create({
  amount: calculateOrderAmount(items),
  currency: "inr",
  automatic_payment_methods: {
   enabled: true,
  },
  description,
  shipping: {
   address: {
    line1: shippingAddress.line1,
    line2: shippingAddress.line2,
    city: shippingAddress.city,
    country: shippingAddress.country,
    // pin_code: shippingAddress.pin_code,
   },
   name: shippingAddress.name,
   phone: shippingAddress.phone,
  },
 });

 res.send({
  clientSecret: paymentIntent.client_secret,
 });
});

app.post("/api/orders", async (req, res) => {
 const {
  userId,
  email,
  orderDate,
  orderTime,
  orderAmount,
  orderStatus,
  cartItems,
  shippingAddress,
  createdAt,
 } = req.body;

 const conn = await pool.getConnection();
 try {
  await conn.beginTransaction();

  // Insert into orders table
  const [orderResult] = await conn.execute(
   `INSERT INTO orders (user_id, email, order_date, order_time, order_amount, order_status)
         VALUES (?, ?, ?, ?, ?, ?)`,
   [userId, email, orderDate, orderTime, orderAmount, orderStatus]
  );
  const orderId = orderResult.insertId;

  // Insert into shipping_addresses table
  const { name, phone, line1, line2, city, country, pin_code } =
   shippingAddress;
  await conn.execute(
   `INSERT INTO shipping_addresses (order_id, name, phone, line1, line2, city, country, pin_code)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
   [orderId, name, phone, line1, line2, city, country, pin_code]
  );

  // Insert each item into order_items table
  console.log(cartItems);
  for (const item of cartItems) {
   const { id, name, description, imageURL, category, price, qty } = item;
   console.log(orderId, id, name, description, imageURL, category, price, qty);
   await conn.execute(
    `INSERT INTO order_items (order_id, product_id, name, description, image_url, category, price, quantity)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [orderId, id, name, description, imageURL, category, price, qty]
   );
  }

  await conn.commit();
  res.status(201).json({ message: "Order saved successfully", orderId });
 } catch (error) {
  await conn.rollback();
  console.error(error);
  res.status(500).json({ error: "Failed to save order" });
 } finally {
  conn.release();
 }
});


// S3 config
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/api/products", authenticateToken, upload.single("image"), async (req, res) => {
  const {
    name,
    price,
    category,
    brand,
    description,
  } = req.body;

  const file = req.file;
  console.log(file)
  if (!file) return res.status(400).json({ error: "Image file is required" });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const ext = path.extname(file.originalname);
    const key = `products/${uuidv4()}${ext}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    const imageURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_PREFIX}/${key}`;

    // 2. Save product to DB
    const [result] = await conn.execute(
      `INSERT INTO products (name, image_url, price, category, brand, description, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, imageURL, price, category, brand, description, new Date()]
    );

    await conn.commit();
    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertId,
      imageURL,
    });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ error: "Failed to create product" });
  } finally {
    conn.release();
  }
});



const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));
