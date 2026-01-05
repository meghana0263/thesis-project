import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]); // Stores the result after filtering
    const [keyword, setKeyword] = useState(''); 
    const [selectedCategory, setSelectedCategory] = useState('All'); 
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await axios.get('/api/products');
            setProducts(data);
            setFilteredProducts(data); // Initially, show everything
        };
        fetchProducts();
    }, []);

    // Extract unique categories automatically from your data
    const categories = ['All', ...new Set(products.map(p => p.category))];

    // The Logic that runs whenever Search OR Category changes
    useEffect(() => {
        let result = products;

        // 1. Filter by Category
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory);
        }

        // 2. Filter by Search Keyword
        if (keyword !== '') {
            result = result.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
        }

        setFilteredProducts(result);
    }, [keyword, selectedCategory, products]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Latest Products</h1>

           
            <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                
                {/* Search Input */}
                <input 
                    type="text"
                    placeholder="Search products..."
                    onChange={(e) => setKeyword(e.target.value)}
                    style={{
                        padding: '10px',
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        marginBottom: '15px',
                        display: 'block'
                    }}
                />

                {/* Category Buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: '8px 15px',
                                border: 'none',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                background: selectedCategory === cat ? '#2c3e50' : '#ddd', 
                                color: selectedCategory === cat ? 'white' : 'black',
                                fontWeight: 'bold'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            
            <div className="products-grid">
                {filteredProducts.map((product) => (
                    <div key={product._id} className="product-card">
                        <Link to={`/product/${product._id}`}>
                            <img src={product.image} alt={product.name} />
                        </Link>
                        <div className="card-body">
                            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <h3>{product.name}</h3>
                            </Link>
                            <p>${product.price}</p>
                            <button onClick={() => addToCart(product)}>Add to Cart</button>
                        </div>
                    </div>
                ))}
                
                
                {filteredProducts.length === 0 && <p>No products found.</p>}
            </div>
        </div>
    );
};

export default Home;