require('dotenv').config();
const mongoose = require('mongoose');

async function connectAndTest() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set in your .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB (plain Node script).');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

connectAndTest();

