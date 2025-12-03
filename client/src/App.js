import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';      // <--- NO curly braces
import Register from './components/Register'; // <--- NO curly braces

function App() {
  return (
    <Router>
      <div className="App">
        {/* Temporary Navigation Bar */}
        <nav style={{ padding: '20px', backgroundColor: '#eee' }}>
          <Link to="/register" style={{ marginRight: '20px' }}>Register</Link>
          <Link to="/login">Login</Link>
        </nav>

        {/* This is where the pages switch */}
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<h1>Welcome to Grocery Store</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;