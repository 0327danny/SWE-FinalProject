// menuRoutes.js

const express = require('express');
const MenuItem = require('../models/MenuItem'); // Make sure this model is created in the models folder
const router = express.Router();

// Fetch all menu items from MongoDB
router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find(); // Get all menu items from the database
        res.status(200).json(menuItems); // Return the menu items as a response
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new menu item
router.post('/', async (req, res) => {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
        return res.status(400).json({ message: 'All fields (name, description, price) are required.' });
    }

    try {
        const newMenuItem = new MenuItem({
            name,
            description,
            price
        });

        await newMenuItem.save(); // Save the new item in MongoDB
        res.status(201).json(newMenuItem); // Return the added item
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a menu item
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedItem = await MenuItem.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Menu item not found.' });
        }

        res.status(200).json({ message: 'Menu item deleted successfully.' }); // Successful deletion
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
