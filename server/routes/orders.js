const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the security guard
const Order = require('../models/Order');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private (Only logged in users)
router.post('/', auth, async (req, res) => {
    try {
        const { orderItems, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ msg: 'No order items' });
        }

        const order = new Order({
            user: req.user.id, // Comes from the 'auth' middleware
            orderItems,
            totalPrice
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;