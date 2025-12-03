import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };

            try {
                const res = await axios.get('/api/orders/myorders', config);
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>My Order History</h1>
            
            {orders.length === 0 ? (
                <h3 style={{ textAlign: 'center', color: '#888' }}>No orders found.</h3>
            ) : (
                orders.map((order) => (
                    <div key={order._id} style={orderCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <div>
                                <strong>Order ID:</strong> {order._id} <br/>
                                <small style={{ color: '#888' }}>Placed on: {new Date(order.createdAt).toLocaleDateString()}</small>
                            </div>
                            <h3 style={{ color: '#27ae60' }}>Total: ${order.totalPrice.toFixed(2)}</h3>
                        </div>

                        <div style={{ marginTop: '10px' }}>
                            {order.orderItems.map((item, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px', marginRight: '15px' }} />
                                    <span>{item.name} (x{item.qty})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const orderCardStyle = {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
};

export default OrderHistory;