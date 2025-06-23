const express = require("express");
const router = express.Router();
const db = require("../config/db");

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
