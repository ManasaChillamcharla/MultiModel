const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URL || process.env.MONGO_URI;
  if (!uri) {
      console.log('No MongoDB URI found. Running without DB.');
      return;
  }
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Running without DB. Some features will not work.');
  }
};

module.exports = connectDB;
