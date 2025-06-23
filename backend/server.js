require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const morgan = require("morgan");
const app = express();

// app.use(cors());
app.use(
 cors({
  origin: "http://localhost:5173", // React frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
 })
);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/products", require("./routes/product.routes"));
// app.use("/api/users", require("./routes/user.routes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
