import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]); // <--- New State for Orders
    
    // State for the form
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        description: '',
        category: '',
        countInStock: ''
    });

    const { name, price, image, description, category, countInStock } = formData;

    useEffect(() => {
        fetchProducts();
        fetchOrders(); // <--- Fetch orders on load
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // New Function: Fetch All Orders
    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        
        try {
            const res = await axios.get('/api/orders', config);
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            }
        };

        try {
            await axios.post('/api/products', formData, config);
            alert('Product Added!');
            setFormData({ name: '', price: '', image: '', description: '', category: '', countInStock: '' });
            fetchProducts();
        } catch (err) {
            console.error(err.response.data);
            alert('Error adding product');
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };

        try {
            await axios.delete(`/api/products/${id}`, config);
            alert('Product Deleted');
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert('Error deleting product');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>Admin Dashboard</h1>

            {/* --- ADD PRODUCT FORM --- */}
            <div style={formStyle}>
                <h3>Add New Product</h3>
                <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input type="text" name="name" placeholder="Product Name" value={name} onChange={onChange} required style={inputStyle} />
                    <input type="number" name="price" placeholder="Price" value={price} onChange={onChange} required style={inputStyle} />
                    <input type="text" name="image" placeholder="Image URL" value={image} onChange={onChange} required style={inputStyle} />
                    <input type="text" name="category" placeholder="Category" value={category} onChange={onChange} required style={inputStyle} />
                    <input type="number" name="countInStock" placeholder="Stock Quantity" value={countInStock} onChange={onChange} required style={inputStyle} />
                    <textarea name="description" placeholder="Description" value={description} onChange={onChange} required style={{ ...inputStyle, gridColumn: 'span 2' }} />
                    <button type="submit" style={submitBtn}>Add Product</button>
                </form>
            </div>

            {/* --- SECTION 1: PRODUCTS --- */}
            <h3 style={{ marginTop: '40px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>📦 Product Inventory</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', marginBottom: '40px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Category</th>
                        <th style={thStyle}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={tdStyle}>{product.name}</td>
                            <td style={tdStyle}>${product.price}</td>
                            <td style={tdStyle}>{product.category}</td>
                            <td style={tdStyle}>
                                <button onClick={() => deleteProduct(product._id)} style={deleteBtn}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* --- SECTION 2: ORDERS (NEW!) --- */}
            <h3 style={{ marginTop: '40px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>📜 Customer Orders</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#e8f4f8', textAlign: 'left' }}>
                        <th style={thStyle}>Order ID</th>
                        <th style={thStyle}>Customer</th>
                        <th style={thStyle}>Date</th>
                        <th style={thStyle}>Total</th>
                        <th style={thStyle}>Items</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={tdStyle}>{order._id}</td>
                            <td style={tdStyle}>{order.user ? order.user.name : 'Unknown User'}</td>
                            <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td style={tdStyle} >${order.totalPrice.toFixed(2)}</td>
                            <td style={tdStyle}>
                                {order.orderItems.length} items
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Styles ---
const formStyle = { backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' };
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd' };
const submitBtn = { gridColumn: 'span 2', padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' };
const thStyle = { padding: '10px', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '10px' };
const deleteBtn = { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' };

export default AdminDashboard;