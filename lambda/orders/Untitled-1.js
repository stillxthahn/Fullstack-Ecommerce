const mysql = require("mysql2/promise");

async function initDatabase() {
 const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
 });

 await connection.query(
  `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
 );
 await connection.end();
 const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
 });

 return pool;
}

const pool = initDatabase();
// const pool = mysql.createPool({
//      host: process.env.DB_HOST,
//      user: process.env.DB_USER,
//      password: process.env.DB_PASSWORD,
//      database: process.env.DB_NAME,
//      waitForConnections: true,
//      connectionLimit: 10,
//      queueLimit: 0,
// });

exports.handler = async (event) => {
 const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "*",
 };

 try {
  const body = JSON.parse(event.body);
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
  } = body;

  const conn = await pool.getConnection();
  try {
   await conn.beginTransaction();

   // Insert into orders
   const [orderResult] = await conn.execute(
    `INSERT INTO orders (user_id, email, order_date, order_time, order_amount, order_status)
                   VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, email, orderDate, orderTime, orderAmount, orderStatus]
   );
   const orderId = orderResult.insertId;

   // Insert shipping address
   const { name, phone, line1, line2, city, country, pin_code } =
    shippingAddress;
   await conn.execute(
    `INSERT INTO shipping_addresses (order_id, name, phone, line1, line2, city, country, pin_code)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [orderId, name, phone, line1, line2, city, country, pin_code]
   );

   // Insert each item into order_items
   for (const item of cartItems) {
    const { id, name, description, imageURL, category, price, qty } = item;
    await conn.execute(
     `INSERT INTO order_items (order_id, product_id, name, description, image_url, category, price, quantity)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
     [orderId, id, name, description, imageURL, category, price, qty]
    );
   }

   await conn.commit();

   return {
    statusCode: 201,
    headers,
    body: JSON.stringify({ message: "Order saved successfully", orderId }),
   };
  } catch (error) {
   await conn.rollback();
   console.error("MySQL transaction failed:", error);
   return {
    statusCode: 500,
    headers,
    body: JSON.stringify({ error: "Failed to save order" }),
   };
  } finally {
   conn.release();
  }
 } catch (error) {
  console.error("Unhandled error:", error);
  return {
   statusCode: 500,
   headers,
   body: JSON.stringify({ error: "Internal Server Error" }),
  };
 }
};
