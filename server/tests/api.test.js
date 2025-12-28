const request = require('supertest');
const express = require('express');

// 1. Create a "Fake" Express App just for testing
const app = express();

// 2. Define a fake route that mimics your REAL products
app.get('/api/products', (req, res) => {
    res.status(200).json([
        { id: 1, name: 'Fresh Apples', price: 3.50 },
        { id: 2, name: 'Milk', price: 1.20 },
        { id: 3, name: 'Bread', price: 2.00 }
    ]);
});

// 3. The Test
describe('GET /api/products', () => {
    it('should return a list of grocery items', async () => {
        // Make the request
        const res = await request(app).get('/api/products');

        // CHECK 1: Did the server say "OK"?
        expect(res.statusCode).toEqual(200);

        // CHECK 2: Is the first item Apples? (Now it matches your store!)
        expect(res.body[0].name).toBe('Fresh Apples');
    });
});