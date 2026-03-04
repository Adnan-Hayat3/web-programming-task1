require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Session middleware for login system
app.use(
  session({
    secret: 'change_this_secret',
    resave: false,
    saveUninitialized: false,
  })
);

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

// User schema/model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

mongoose.model('User', userSchema);

// Mount auth routes
const userRoutes = require('./routes/user');
app.use('/', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

