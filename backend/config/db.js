const mysql = require("mysql2");

const pool = mysql.createPool({
 host: process.env.RDS_HOST,
 user: process.env.RDS_USER,
 password: process.env.RDS_PASSWORD,
 database: process.env.RDS_DB,
});
// const pool = mysql.createPool({
//  host: "localhost",
//  user: "root",
//  password: "123456",
//  database: "mydb",
// });

pool.getConnection((err, connection) => {
 if (err) {
  console.error("❌ MySQL connection error:", err.message);
 } else {
  console.log("✅ Connected to MySQL database");
  connection.release();
 }
});

module.exports = pool.promise();
