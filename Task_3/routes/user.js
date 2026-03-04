const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Reuse the already-registered Mongoose model
const User = mongoose.model('User');

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.status(401).send('Unauthorized');
}

// Register Route: POST /register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('username and password are required');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const user = new User({ username, password });
    await user.save();

    res.send('User registered successfully');
  } catch (error) {
    console.error('Error in /register:', error);
    res.status(500).send('Failed to register user');
  }
});

// Login Route: POST /login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send('username and password are required');
    }

    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).send('Invalid username or password');
    }

    req.session.user = username;
    res.send('Login successful');
  } catch (error) {
    console.error('Error in /login:', error);
    res.status(500).send('Failed to login');
  }
});

// Dashboard Route (Protected): GET /dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.send(`Welcome ${req.session.user}`);
});

// Logout Route: GET /logout
router.get('/logout', (req, res) => {
  if (!req.session) {
    return res.send('Logout successful');
  }

  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Failed to logout');
    }
    res.send('Logout successful');
  });
});

module.exports = router;

