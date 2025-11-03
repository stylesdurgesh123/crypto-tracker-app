const mongoose = require("mongoose");

async function connectToMongoDB(url) {
  try {
    await mongoose.connect(url);
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }
}

module.exports = connectToMongoDB;
