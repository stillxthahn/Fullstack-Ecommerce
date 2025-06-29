require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const {
 SecretsManagerClient,
 GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

// app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const secret_name = "d/ec/backend";
const client = new SecretsManagerClient({ region: "us-east-1" });

// app.use(
//  cors({
//   origin: "http://localhost:5173", // React frontend
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
//  })
// );

client
 .send(
  new GetSecretValueCommand({
   SecretId: secret_name,
   VersionStage: "AWSCURRENT",
  })
 )
 .then((response) => {
  const secret = JSON.parse(response.SecretString);

  // Gán biến môi trường từ secret
  process.env.JWT_SECRET = secret.JWT_SECRET;
  process.env.STRIPE_SECRET_KEY = secret.STRIPE_SECRET_KEY;
  process.env.AWS_REGION = secret.AWS_REGION;
  process.env.AWS_ACCESS_KEY_ID = secret.AWS_ACCESS_KEY_ID;
  process.env.AWS_SECRET_ACCESS_KEY = secret.AWS_SECRET_ACCESS_KEY;
  process.env.AWS_BUCKET_NAME = secret.AWS_BUCKET_NAME;
  process.env.AWS_BUCKET_PREFIX = secret.AWS_BUCKET_PREFIX;
  process.env.RDS_HOST = secret.RDS_HOST;
  process.env.RDS_USER = secret.RDS_USER;
  process.env.RDS_PASSWORD = secret.RDS_PASSWORD;
  process.env.RDS_DB = secret.RDS_DB;
  // Middleware setup
  app.use(
   cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
   })
  );
  app.use(express.json());
  app.use(morgan("dev"));

  // Health check
  app.get("/health", (req, res) => {
   res.status(200).json({ status: "ok" });
  });

  // Routes
  app.use("/api/auth", require("./routes/auth.routes"));
  app.use("/api/products", require("./routes/product.routes"));
  app.use("/api/orders", require("./routes/order.routes"));

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
 })
 .catch((err) => {
  console.error("❌ Failed to load secrets:", err);
  process.exit(1);
 });
app.get("/health", (req, res) => {
 res.status(200).json({ status: "ok" });
});

// app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api/products", require("./routes/product.routes"));
// app.use("/api/orders", require("./routes/order.routes"));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
