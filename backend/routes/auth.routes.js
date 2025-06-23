const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // MySQL connection

router.post("/login", async (req, res) => {
 const { email, password } = req.body;

 try {
  const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
   email,
  ]);
  const user = users[0];

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
   { userId: user.id, email: user.email },
   process.env.JWT_SECRET,
   {
    expiresIn: "1h",
   }
  );

  res.json({ token, user: { id: user.id, email: user.email } });
 } catch (err) {
  console.error("Login error:", err);
  res.status(500).json({ message: "Server error" });
 }
});

router.post("/register", async (req, res) => {
 const { email, password } = req.body;

 try {
  const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
   email,
  ]);
  if (existing.length > 0) {
   return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [
   email,
   hashedPassword,
  ]);

  res.status(201).json({ message: "Registration successful" });
 } catch (err) {
  console.error("Registration error:", err);
  res.status(500).json({ message: "Server error" });
 }
});

module.exports = router;
