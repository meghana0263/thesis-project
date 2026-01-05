import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    const checkoutHandler = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to checkout');
        navigate('/login');
    } else {
        navigate('/payment'); // <--- Just go to payment page!
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
                    
                    
                    <button onClick={checkoutHandler} style={checkoutBtn}>
                        Proceed to Checkout
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