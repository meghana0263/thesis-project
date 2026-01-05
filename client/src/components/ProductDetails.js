import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`/api/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProduct();
    }, [id]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) return alert('Please login to review');

            const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };
            
            await axios.post(`/api/products/${id}/reviews`, { rating, comment }, config);
            alert('Review Submitted!');
            setComment('');
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting review');
        }
    };

    if (!product) return <h2>Loading...</h2>;

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            <button onClick={() => navigate('/')} style={backBtn}>← Back</button>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '20px' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '10px' }} />
                
                <div>
                    <h1>{product.name}</h1>
                    <h3 style={{ color: '#27ae60' }}>${product.price}</h3>
                    <p>{product.description}</p>
                    <p>Category: <strong>{product.category}</strong></p>
                    <p>Stock: {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</p>
                    
                    <button 
                        onClick={() => addToCart(product)} 
                        style={addBtn}
                        disabled={product.countInStock === 0}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>

            {/*  REVIEW FORM SECTION */}
            <div style={{ marginTop: '50px', background: '#f9f9f9', padding: '30px', borderRadius: '10px' }}>
                <h3>Write a Customer Review</h3>
                <form onSubmit={submitHandler}>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Rating: </label>
                        <select value={rating} onChange={(e) => setRating(e.target.value)} style={inputStyle}>
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Very Good</option>
                            <option value="3">3 - Good</option>
                            <option value="2">2 - Fair</option>
                            <option value="1">1 - Poor</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <textarea 
                            value={comment} 
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts..."
                            style={{ ...inputStyle, width: '100%', height: '100px' }}
                        ></textarea>
                    </div>
                    <button type="submit" style={submitBtn}>Submit Review</button>
                </form>
            </div>
        </div>
    );
};

// Styles
const backBtn = { background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer', marginBottom: '20px' };
const addBtn = { padding: '15px 30px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1rem' };
const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd' };
const submitBtn = { padding: '10px 20px', background: '#2980b9', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default ProductDetails;