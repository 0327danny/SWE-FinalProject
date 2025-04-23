// routes/reservationRoutes.js

const express = require('express');
const Reservation = require('../models/Reservation');
const authMiddleware = require('../middleware/authMiddleware');  // Import authMiddleware
const router = express.Router();

// Create a reservation
router.post('/create', authMiddleware, async (req, res) => {
  const { date, guests } = req.body;
  
  // Use req.userId from JWT to ensure the reservation is tied to the logged-in user
  try {
    const newReservation = new Reservation({ userId: req.userId, date, guests });
    await newReservation.save();
    res.status(201).json({ msg: 'Reservation created successfully' });
  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all reservations for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Retrieve only the reservations that belong to the logged-in user
    const reservations = await Reservation.find({ userId: req.userId }).populate('userId');
    res.json(reservations);
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
