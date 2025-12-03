const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String, // We will store the URL of the image
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Product', ProductSchema);