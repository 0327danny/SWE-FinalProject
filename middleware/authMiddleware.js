// authMiddleware.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Check for token in Authorization header
    const token = req.headers['authorization']?.split(' ')[1];  // Authorization: Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }

        // Attach the user ID to the request object for use in route handlers
        req.userId = decoded.userId;  
        next();  // Proceed to the next middleware or route handler
    });
};

module.exports = authMiddleware;
