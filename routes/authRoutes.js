const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    const { name, email, username, password } = req.body;

    // Check if all required fields are present
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if the email is already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        // Check if the username is already taken (if provided)
        if (username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ message: 'Username already taken.' });
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ name, email, username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully! Please log in.' });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Check if the credentials match the hardcoded admin credentials
        if (email === 'admin@admin.com' && password === 'admin') {
            // Generate JWT token for admin
            const token = jwt.sign({ userId: 'admin', role: 'admin' }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
            return res.status(200).json({ message: 'Login successful', token, role: 'admin' });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Check the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT token for regular user
        const token = jwt.sign({ userId: user._id, role: 'user' }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

        // Return the token with the success message and the user's role
        res.status(200).json({ message: 'Login successful', token, role: 'user' });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
