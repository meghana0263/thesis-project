import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]); // <--- New State for filtered list
    const [activeCategory, setActiveCategory] = useState('All');  // <--- Track active button
    
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/products');
                setProducts(res.data);
                setFilteredProducts(res.data); // Initially show ALL
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        fetchProducts();
    }, []);

    // Filter Function
    const filterCategory = (category) => {
        setActiveCategory(category);
        if (category === 'All') {
            setFilteredProducts(products);
        } else {
            const newList = products.filter(item => item.category === category);
            setFilteredProducts(newList);
        }
    };

    return (
        <div className="container">
            <h1 style={{ textAlign: 'center', margin: '40px 0', fontSize: '2.5rem' }}>Welcome to FreshCart</h1>
            
            {/* --- CATEGORY BUTTONS --- */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                {['All', 'Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Beverages', 'Snacks'].map(cat => (
                    <button 
                        key={cat}
                        onClick={() => filterCategory(cat)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '20px',
                            border: '1px solid #ddd',
                            backgroundColor: activeCategory === cat ? '#27ae60' : 'white',
                            color: activeCategory === cat ? 'white' : '#333',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* --- PRODUCT GRID --- */}
            <div className="products-grid">
                {products.map(product => (
                    <div key={product._id} className="product-card">
      
                    {/* 1. Wrap the Image */}
                    <Link to={`/product/${product._id}`}>
                        <img src={product.image} alt={product.name} />
                    </Link>
      
                    <div className="card-body">
                        {/* 2. Wrap the Title */}
                        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h3>{product.name}</h3>
                        </Link>

                    <p>${product.price}</p>
        
                    <button onClick={() => addToCart(product)}>
                        Add to Cart
                    </button>
                </div>
            </div>
            ))}
            </div>
        </div>
    );
};

export default Home;