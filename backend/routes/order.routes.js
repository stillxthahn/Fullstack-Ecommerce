const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateUser } = require("../middleware/auth");

router.get("/", authenticateUser, async (req, res) => {
 try {
  const [orders] = await db.query(
   `SELECT * FROM orders ORDER BY created_at DESC`
  );

  for (const order of orders) {
   const [shipping] = await db.query(
    `SELECT * FROM shipping_addresses WHERE order_id = ?`,
    [order.id]
   );
   const [items] = await db.query(
    `SELECT * FROM order_items WHERE order_id = ?`,
    [order.id]
   );
   order.shippingAddress = shipping[0] || null;
   order.cartItems = items || [];
  }

  res.json(orders);
 } catch (error) {
  console.error("Error fetching products:", error);
  res.status(500).json({ message: "Server error" });
 }
});

router.get("/:id", authenticateUser, async (req, res) => {
 const orderId = req.params.id;

 try {
  const [orders] = await db.query("SELECT * FROM orders WHERE id = ?", [
   orderId,
  ]);

  if (orders.length === 0) {
   return res.status(404).json({ message: "Order not found" });
  }

  const order = orders[0];

  const [shipping] = await db.query(
   "SELECT * FROM shipping_addresses WHERE order_id = ?",
   [order.id]
  );

  // Lấy order items
  const [items] = await db.query(
   "SELECT * FROM order_items WHERE order_id = ?",
   [order.id]
  );

  order.shippingAddress = shipping[0] || null;
  order.cartItems = items || [];

  res.json(order);
 } catch (error) {
  console.error("Error fetching order:", error);
  res.status(500).json({ message: "Server error" });
 }
});

// PUT /api/orders/:id
router.put("/:id", authenticateUser, async (req, res) => {
 const orderId = req.params.id;
 const updatedOrder = req.body;

 try {
  await db.query("UPDATE orders SET ? WHERE id = ?", [updatedOrder, orderId]);
  res.json({ message: "Order updated successfully" });
 } catch (error) {
  console.error("Error updating order:", error);
  res.status(500).json({ message: "Server error" });
 }
});
module.exports = router;
