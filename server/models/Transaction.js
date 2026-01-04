const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },
    user: { // Useful to know WHO paid
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    paymentResult: {
        id: String,
        status: String,
        email_address: String
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);