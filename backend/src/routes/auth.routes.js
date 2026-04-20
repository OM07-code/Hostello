const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    if (user.status !== 'Active') return res.status(403).json({ error: 'Account is inactive' });

    const token = jwt.sign(
      { id: user._id, role: user.role, hostelId: user.hostelId },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '12h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hostelId: user.hostelId
      }
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

router.post('/register', async (req, res) => {
  try {
    // Basic validation
    const { name, email, password, role, hostelId } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Required fields missing' });

    // Check existing
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const user = new User({ name, email, password, role, hostelId });
    await user.save();

    res.status(201).json({ message: 'User registered successfully. Please login.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

module.exports = router;
