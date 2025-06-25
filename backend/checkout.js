require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql2/promise");
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const morgan = require("morgan");
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
const pool = mysql.createPool({
 host: "localhost", // nếu cùng container thì dùng "mysql-container" hoặc "mysql" (Docker Compose)
 user: "root",
 password: "123456",
 database: "mydb",
});

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

// GET /api/orders
app.get("/api/orders", async (req, res) => {
 const conn = await pool.getConnection();
 try {
  // Lấy đơn hàng + địa chỉ giao hàng (JOIN nếu cần)
  const [orders] = await conn.query(
   `SELECT * FROM orders ORDER BY created_at DESC`
  );

  // Option: thêm shipping address, items vào từng đơn hàng (nếu muốn chi tiết)
  for (const order of orders) {
   const [shipping] = await conn.query(
    `SELECT * FROM shipping_addresses WHERE order_id = ?`,
    [order.id]
   );
   const [items] = await conn.query(
    `SELECT * FROM order_items WHERE order_id = ?`,
    [order.id]
   );
   order.shippingAddress = shipping[0] || null;
   order.cartItems = items || [];
  }

  res.status(200).json(orders);
 } catch (err) {
  console.error("❌ Failed to fetch orders", err);
  res.status(500).json({ error: "Failed to fetch orders" });
 } finally {
  conn.release();
 }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));
