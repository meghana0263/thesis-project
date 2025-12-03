import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Calculate Total
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    const checkoutHandler = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to place an order!');
            navigate('/login');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token // Send the "ID Card"
                }
            };

            const orderItems = cart.map((item) => ({
                product: item._id, 
                name: item.name,
                qty: item.qty,
                image: item.image,
                price: item.price
            }));

            const orderData = {
                orderItems: orderItems,
                totalPrice: totalPrice
            };

            await axios.post('/api/orders', orderData, config);

            alert('Order Placed Successfully! Thank you for shopping.');
            // Ideally, we clear the cart here, but for now just redirect
            navigate('/');
            
        } catch (err) {
            console.error(err);
            alert('Order Failed. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>Shopping Cart</h1>

            {cart.length === 0 ? (
                <h3 style={{ textAlign: 'center', color: '#888' }}>Your cart is empty.</h3>
            ) : (
                <div>
                    {cart.map((item) => (
                        <div key={item._id} style={itemStyle}>
                            <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} />
                            
                            <div style={{ flex: 1, marginLeft: '20px' }}>
                                <h3>{item.name}</h3>
                                <p>${item.price} x {item.qty}</p>
                            </div>

                            <button onClick={() => removeFromCart(item._id)} style={deleteBtn}>Remove</button>
                        </div>
                    ))}
                    
                    <h2 style={{ textAlign: 'right', marginTop: '20px' }}>
                        Total: ${totalPrice.toFixed(2)}
                    </h2>
                    
                    {/* Updated Button with Click Handler */}
                    <button onClick={checkoutHandler} style={checkoutBtn}>
                        Place Order
                    </button>
                </div>
            )}
        </div>
    );
};

// Styles remain the same...
const itemStyle = { display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '15px 0' };
const deleteBtn = { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' };
const checkoutBtn = { display: 'block', width: '100%', backgroundColor: '#27ae60', color: 'white', padding: '15px', fontSize: '18px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' };

export default Cart;