const mysql = require("mysql2");

const pool = mysql.createPool({
 host: "d-ec-rds.cxiow4kwa1fe.us-east-1.rds.amazonaws.com",
 user: "admin",
 password: "xuanthanh235",
 database: "mydb",
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
