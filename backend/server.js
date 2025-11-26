const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");

const { connectDB } = require("./config/db");

const app = express();

// ----------------------
// Middlewares
// ----------------------
// CORS configuration
app.use((req, res, next) => {
  // Allow requests from your frontend origin
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  // Allow credentials (cookies, authorization headers, etc.)
  res.header('Access-Control-Allow-Credentials', 'true');
  // Allow specific headers
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  // Allow specific methods
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// ----------------------
// Setup DB Route (MUST be here, AFTER app is defined)
// ----------------------
app.post("/api/setupDb", async (req, res) => {
  try {
    console.log("setupDb called");

    if (!mongoose.connection.readyState) {
      return res.status(500).json({
        success: false,
        message: "MongoDB is not connected",
      });
    }

    const db = mongoose.connection.db;
    await db.createCollection("setupCheck");
    await db.dropCollection("setupCheck");

    res.json({
      success: true,
      message: "Database verified and ready",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Setup failed",
      error: err.message,
    });
  }
});

// ----------------------
// All other routes
// ----------------------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
// ...

// ----------------------
// Start server after DB connects
// ----------------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✔ Mongo Connected");

    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start:", err);
    process.exit(1);
  }
};

startServer();