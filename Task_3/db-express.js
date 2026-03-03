require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set in your .env file.');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB (Express app).');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('Express + MongoDB connection is working.');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

