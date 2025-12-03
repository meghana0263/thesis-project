
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';      
import Register from './components/Register'; 
import Home from './components/Home';
import { CartProvider } from './context/CartContext'; 
import Cart from './components/Cart'; 
import OrderHistory from './components/OrderHistory';

function App() {
  return (
    <CartProvider> 
      <Router>
        <div className="App">
          <nav style={{ padding: '20px', backgroundColor: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
            <div>
               <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none', fontWeight: 'bold' }}>GROCERY STORE</Link>
            </div>
            <div>
              <Link to="/register" style={{ color: 'white', marginRight: '20px' }}>Register</Link>
              <Link to="/login" style={{ color: 'white', marginRight: '20px' }}>Login</Link>
              <Link to="/orders" style={{ color: 'white', marginRight: '20px' }}>My Orders</Link>
              <Link to="/cart" style={{ color: '#f1c40f', fontWeight: 'bold' }}>Cart</Link>
            </div>
          </nav>

          <div style={{ padding: '20px' }}>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} /> 
              <Route path="/orders" element={<OrderHistory />} />
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider> 
    );
}

export default App;