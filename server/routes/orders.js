const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the security guard
const Order = require('../models/Order');
const admin = require('../middleware/admin'); // Import admin check

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/', auth, admin, async (req, res) => {
    try {
        // Find ALL orders, and populate the 'user' field so we know WHO bought it
        const orders = await Order.find()
            .populate('user', 'id name')
            .sort({ createdAt: -1 }); // Newest first
            
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

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

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', auth, async (req, res) => {
    try {
        // Find orders where the 'user' field matches the ID in the token
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;