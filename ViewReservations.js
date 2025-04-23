const express = require('express');
const jwt = require('jsonwebtoken');
const Reservation = require('./models/Reservation'); // Import Reservation model
const User = require('./models/User'); // Import User model
const app = express();

app.use(express.json());

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key';

const adminMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Access Denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have admin rights' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

app.get('/api/reservations', adminMiddleware, async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch reservations' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
