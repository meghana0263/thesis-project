import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Added Link

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const body = JSON.stringify({ email, password });
            
            const res = await axios.post('/api/users/login', body, config);
            
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            console.error(err.response.data);
            alert('Login Failed: ' + (err.response.data.msg || 'Server Error'));
        }
    };

    return (
        <div className="form-container">
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>Welcome Back</h2>
            <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '30px' }}>Sign in to continue shopping</p>
            
            <form onSubmit={onSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Email Address</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={email} 
                        onChange={onChange}
                        required 
                        placeholder="Enter your email"
                    />
                </div>
                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={password} 
                        onChange={onChange}
                        minLength="6"
                        placeholder="Enter your password"
                    />
                </div>
                
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                New customer? <Link to="/register" style={{ color: '#3498db', fontWeight: 'bold' }}>Create Account</Link>
            </p>
        </div>
    );
};

export default Login;