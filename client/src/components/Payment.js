import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const Payment = () => {
    const navigate = useNavigate();
    const { cart } = useContext(CartContext);
    
    
    const [cardData, setCardData] = useState({
        holder: '',
        number: '',
        expiry: '',
        cvv: ''
    });

    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    const onChange = e => setCardData({ ...cardData, [e.target.name]: e.target.value });

    // This runs when they click "Pay Now"
    const onPay = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        try {
            const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
            
            // Map data for backend
            const orderItems = cart.map(item => ({
                product: item._id,
                name: item.name,
                qty: item.qty,
                image: item.image,
                price: item.price
            }));

            const orderData = { orderItems, totalPrice };

            // CALL THE API (Actually places the order)
            await axios.post('/api/orders', orderData, config);

            alert('Payment Successful! Order Placed.');
            navigate('/orders'); // Send them to Order History
            

        } catch (err) {
            console.error(err);
            alert('Payment Failed. Please try again.');
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '500px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Secure Checkout</h2>
            <h3 style={{ textAlign: 'center', color: '#27ae60', marginBottom: '30px' }}>Total: ${totalPrice.toFixed(2)}</h3>

            <form onSubmit={onPay}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Cardholder Name</label>
                    <input type="text" name="holder" required placeholder="John Doe" onChange={onChange} />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label>Card Number</label>
                    <input type="text" name="number" required placeholder="0000 0000 0000 0000" maxLength="19" onChange={onChange} />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label>Expiry Date</label>
                        <input type="text" name="expiry" required placeholder="MM/YY" maxLength="5" onChange={onChange} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>CVV</label>
                        <input type="text" name="cvv" required placeholder="123" maxLength="3" onChange={onChange} />
                    </div>
                </div>

                <button type="submit" className="btn-success" style={{ marginTop: '20px' }}>
                    Pay & Place Order 🔒
                </button>
            </form>
        </div>
    );
};

export default Payment;