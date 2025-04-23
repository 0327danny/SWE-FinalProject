const express = require('express');
const Promotion = require('../models/Promotion');
const router = express.Router();

// Get promotions
router.get('/', async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
