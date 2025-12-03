import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    // 1. State for Name, Email, Password
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { name, email, password } = formData;
    const navigate = useNavigate();

    // 2. Update state on typing
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // 3. Submit data to Backend
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            const body = JSON.stringify({ name, email, password });

            // Call the Register API
            const res = await axios.post('/api/users/register', body, config);

            // Auto-login (save token)
            console.log('Registration Success!', res.data);
            localStorage.setItem('token', res.data.token); // Save the token immediately
            
            alert('Registration Successful!');
            navigate('/'); // Go to Home Page

        } catch (err) {
            console.error(err.response.data);
            alert('Error: ' + (err.response.data.msg || 'Registration Failed'));
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>Create Account</h2>
            <form onSubmit={onSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        name="name" 
                        value={name} 
                        onChange={onChange}
                        required 
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        name="email" 
                        value={email} 
                        onChange={onChange}
                        required 
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        name="password" 
                        value={password} 
                        onChange={onChange}
                        minLength="6"
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Register</button>
            </form>
        </div>
    );
};

export default Register;