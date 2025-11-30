const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Placeholder for Database Connection
// mongoose.connect(process.env.MONGO_URI);

app.get('/', (req, res) => {
    res.send('Thesis Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});