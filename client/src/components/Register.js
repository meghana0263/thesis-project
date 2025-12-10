import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { name, email, password } = formData;
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const body = JSON.stringify({ name, email, password });

            const res = await axios.post('/api/users/register', body, config);

            localStorage.setItem('token', res.data.token);
            alert('Registration Successful!');
            navigate('/');

        } catch (err) {
            console.error(err.response.data);
            alert('Error: ' + (err.response.data.msg || 'Registration Failed'));
        }
    };

    return (
        <div className="form-container">
            <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#2c3e50' }}>Create Account</h2>
            <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '30px' }}>Join us for fresh groceries today</p>

            <form onSubmit={onSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Full Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={name} 
                        onChange={onChange}
                        required 
                        placeholder="John Doe"
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Email Address</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={email} 
                        onChange={onChange}
                        required 
                        placeholder="john@example.com"
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
                        placeholder="Min 6 characters"
                    />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>Register</button>
            </form>

            <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                Already have an account? <Link to="/login" style={{ color: '#3498db', fontWeight: 'bold' }}>Login</Link>
            </p>
        </div>
    );
};

export default Register;