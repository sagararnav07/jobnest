const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return mongoose.connection;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME || "job-nest",
    });

    isConnected = true;
    console.log("MongoDB connected:", mongoose.connection.host);
    return mongoose.connection;

  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

const setupDatabase = async () => {
  try {
    console.log("Setting up database...");

    // Create DB simply by connecting to it
    await connectDB();

    // Optional: ensure collections exist
    await mongoose.connection.db.createCollection("users").catch(() => {});
    await mongoose.connection.db.createCollection("jobs").catch(() => {});

    console.log(`Database '${process.env.MONGO_DB_NAME}' is ready.`);

  } catch (error) {
    console.error("Database setup error:", error);
    throw error;
  }
};

module.exports = {
  connectDB,
  setupDatabase,
};