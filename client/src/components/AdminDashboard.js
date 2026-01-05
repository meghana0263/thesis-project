import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
    ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [timeRange, setTimeRange] = useState('all'); 

    // Form State
    const [formData, setFormData] = useState({
        name: '', price: '', image: '', description: '', category: '', countInStock: ''
    });
    const { name, price, image, description, category, countInStock } = formData;

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchProducts = async () => {
        try { const res = await axios.get('/api/products'); setProducts(res.data); } 
        catch (err) { console.error(err); }
    };

    const fetchOrders = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        try { const res = await axios.get('/api/orders', config); setOrders(res.data); } 
        catch (err) { console.error(err); }
    };

    //  DELETE FUNCTION
    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                await axios.delete(`/api/products/${id}`, config);
                alert('Product Deleted');
                fetchProducts(); // Refresh list immediately
            } catch (error) {
                alert('Error deleting product');
            }
        }
    };

    // --- ANALYTICS LOGIC  ---
    const filteredOrders = useMemo(() => {
        if (timeRange === 'all') return orders;
        const now = new Date();
        const days = timeRange === '7days' ? 7 : 30;
        const cutoff = new Date(now.setDate(now.getDate() - days));
        return orders.filter(o => new Date(o.createdAt) >= cutoff);
    }, [orders, timeRange]);

    const totalRevenue = filteredOrders.reduce((acc, order) => acc + order.totalPrice, 0);
    const avgOrderValue = filteredOrders.length ? (totalRevenue / filteredOrders.length) : 0;

    const composedData = useMemo(() => {
        const group = filteredOrders.reduce((acc, order) => {
            const date = new Date(order.createdAt).toLocaleDateString();
            if (!acc[date]) acc[date] = { date, revenue: 0, count: 0 };
            acc[date].revenue += order.totalPrice;
            acc[date].count += 1;
            return acc;
        }, {});
        return Object.values(group).reverse();
    }, [filteredOrders]);

    const radarData = useMemo(() => {
        const stats = {};
        products.forEach(p => {
            if (!stats[p.category]) stats[p.category] = { subject: p.category, A: 0, fullMark: 100 };
        });
        orders.forEach(o => {
            o.orderItems.forEach(item => {
                const prod = products.find(p => p._id === item.product);
                if (prod && stats[prod.category]) {
                    stats[prod.category].A += item.qty;
                }
            });
        });
        return Object.values(stats);
    }, [products, orders]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const onSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
        try {
            await axios.post('/api/products', formData, config);
            alert('Product Added!');
            setFormData({ name: '', price: '', image: '', description: '', category: '', countInStock: '' });
            fetchProducts();
        } catch (err) { 
            alert(err.response?.data?.message || 'Error adding product'); 
        }
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1600px', margin: '0 auto', background: '#f0f2f5', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            
            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#1a365d', margin: 0 }}>📊 Executive Analytics</h1>
                <div style={{ background: 'white', padding: '5px', borderRadius: '8px' }}>
                    {['all', '30days', '7days'].map(range => (
                        <button 
                            key={range}
                            onClick={() => setTimeRange(range)}
                            style={{ padding: '8px 16px', border: 'none', background: timeRange === range ? '#2b6cb0' : 'transparent', color: timeRange === range ? 'white' : '#718096', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', textTransform: 'capitalize' }}
                        >
                            {range === 'all' ? 'All Time' : range.replace('days', ' Days')}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <KpiCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon="💰" color="#48bb78" />
                <KpiCard title="Total Orders" value={filteredOrders.length} icon="📦" color="#4299e1" />
                <KpiCard title="Avg. Order Value" value={`$${avgOrderValue.toFixed(2)}`} icon="📈" color="#ed8936" />
                <KpiCard title="Products Active" value={products.length} icon="🍎" color="#9f7aea" />
            </div>

            {/* CHARTS */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={panelStyle}>
                    <h3>Revenue & Order Volume</h3>
                    <div style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={composedData}>
                                <CartesianGrid stroke="#f5f5f5" />
                                <XAxis dataKey="date" />
                                <YAxis yAxisId="left" orientation="left" stroke="#2b6cb0" />
                                <YAxis yAxisId="right" orientation="right" stroke="#f6ad55" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="revenue" barSize={20} fill="#2b6cb0" name="Revenue ($)" />
                                <Line yAxisId="right" type="monotone" dataKey="count" stroke="#f6ad55" strokeWidth={3} name="Orders (#)" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div style={panelStyle}>
                    <h3>Category Performance</h3>
                    <div style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius={90} data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']}/>
                                <Radar name="Sales Vol" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                <Legend />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* MANAGEMENT SECTION */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                {/* ADD PRODUCT FORM */}
                <div style={panelStyle}>
                    <h3>Add New Product</h3>
                    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input name="name" placeholder="Name" value={name} onChange={onChange} required style={inputStyle} />
                        <input name="price" type="number" placeholder="Price" value={price} onChange={onChange} required style={inputStyle} />
                        <select name="category" value={category} onChange={onChange} required style={inputStyle}>
                            <option value="">Category</option>
                            <option value="Vegetables">Vegetables</option>
                            <option value="Fruits">Fruits</option>
                            <option value="Dairy">Dairy</option>
                            <option value="Beverages">Beverages</option>
                        </select>
                        <input name="countInStock" placeholder="Stock" value={countInStock} onChange={onChange} required style={inputStyle} />
                        <textarea name="description" placeholder="Description" value={description} onChange={onChange} required style={{ ...inputStyle, height: '80px', fontFamily: 'inherit' }} />
                        <input name="image" placeholder="Image URL" value={image} onChange={onChange} required style={inputStyle} />
                        <button type="submit" style={btnStyle}>Add Product</button>
                    </form>
                </div>

                {/* INVENTORY LIST (WITH DELETE BUTTON) */}
                <div style={panelStyle}>
                    <h3>Inventory Status</h3>
                    <div style={{ overflowY: 'auto', maxHeight: '300px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ background: '#f7fafc', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Product</th>
                                    <th style={{ padding: '10px' }}>Price</th>
                                    <th style={{ padding: '10px' }}>Stock</th>
                                    <th style={{ padding: '10px' }}>Action</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>{p.name}</td>
                                        <td style={{ padding: '10px' }}>${p.price}</td>
                                        <td style={{ padding: '10px', color: p.countInStock < 5 ? 'red' : 'green' }}>{p.countInStock}</td>
                                        
                                        {/* 👇 DELETE BUTTON */}
                                        <td style={{ padding: '10px' }}>
                                            <button 
                                                onClick={() => deleteHandler(p._id)}
                                                style={{ 
                                                    background: '#e53e3e', 
                                                    color: 'white', 
                                                    border: 'none', 
                                                    padding: '5px 10px', 
                                                    borderRadius: '4px', 
                                                    cursor: 'pointer' 
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- STYLES ---
const KpiCard = ({ title, value, icon, color }) => (
    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{icon}</div>
        <div>
            <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>{title}</p>
            <h2 style={{ margin: 0, color: '#2d3748', fontSize: '1.8rem' }}>{value}</h2>
        </div>
    </div>
);
const panelStyle = { background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.95rem' };
const btnStyle = { padding: '10px', background: '#3182ce', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

export default AdminDashboard;