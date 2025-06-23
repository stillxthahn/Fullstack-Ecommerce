const mysql = require("mysql2");

const pool = mysql.createPool({
 host: "localhost", // nếu cùng container thì dùng "mysql-container" hoặc "mysql" (Docker Compose)
 user: "root",
 password: "123456",
 database: "mydb",
});

pool.getConnection((err, connection) => {
 if (err) {
  console.error("❌ MySQL connection error:", err.message);
 } else {
  console.log("✅ Connected to MySQL database");
  connection.release();
 }
});

module.exports = pool.promise();
