const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const User = require('../models/User');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/products
// @desc    Add a new product
// @access  Public (We will make this Admin-only later)
router.post('/', auth, admin, async (req, res) => {
    const { name, description, price, category, image, countInStock } = req.body;

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            image,
            countInStock
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.post('/:id/reviews', auth, async (req, res) => {
    const { rating, comment } = req.body;
    
    try {
        const product = await Product.findById(req.params.id);
        const user = await User.findById(req.user.id); 

        if (product) {
            const alreadyReviewed = await Review.findOne({
                user: req.user.id,
                product: product._id
            });

            if (alreadyReviewed) {
                return res.status(400).json({ message: 'Product already reviewed' });
            }

            const review = new Review({
                name: user.name,    
                rating: Number(rating),
                comment,
                user: req.user.id,
                product: product._id
            });

            await review.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        // If the ID format is invalid (e.g. not a MongoDB ObjectId), return 404
        res.status(404).json({ message: 'Product not found' });
    }
});

module.exports = router;