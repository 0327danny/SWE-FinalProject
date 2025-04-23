const express = require('express');
const Inventory = require('../models/Inventory');
const router = express.Router();

// Get inventory
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update inventory
router.put('/:id', async (req, res) => {
  const { quantity } = req.body;
  try {
    const inventoryItem = await Inventory.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
    res.json(inventoryItem);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
