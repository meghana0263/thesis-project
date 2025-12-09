
import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react'; 
import { CartContext } from '../context/CartContext'; 
const Home = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/products');
                setProducts(res.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="container">
            <h1 style={{ textAlign: 'center', margin: '40px 0', fontSize: '2.5rem' }}>Fresh Groceries</h1>
            
            <div className="product-grid">
                {products.map(product => (
                    <div key={product._id} className="product-card">
                        <img src={product.image} alt={product.name} />
                        <div className="card-body">
                            <h3>{product.name}</h3>
                            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>{product.description}</p>
                            <div className="price-tag">${product.price.toFixed(2)}</div>
                            <button 
                                className="btn-primary" 
                                onClick={() => addToCart(product)}
                            >
                                Add to Cart 🛒
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Simple CSS Styles (Internal) ---
const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive grid
    gap: '20px',
    padding: '20px'
};

const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    textAlign: 'center'
};

const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
};

const buttonStyle = {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px'
};

export default Home;