// config/db.js
require('dotenv').config();
const mongoose = require("mongoose");

// Set strictQuery explicitly to suppress the warning
//mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }
    await mongoose.connect(process.env.MONGO_URI);  // Remove deprecated options
    console.log(" ======> MongoDB connected successfully");
  } catch (error) {
    console.error("******MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
