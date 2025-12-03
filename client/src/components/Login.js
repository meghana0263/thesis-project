import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // 1. State to hold the email and password you type
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;
    const navigate = useNavigate(); // Hook to move between pages

    // 2. Update state when you type in the boxes
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // 3. Send data to the backend when you click "Login"
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            
            const body = JSON.stringify({ email, password });

            // This sends the POST request to your backend
            const res = await axios.post('/api/users/login', body, config);

            // 4. Save the "Token" in your browser storage
            console.log('Login Success!', res.data);
            localStorage.setItem('token', res.data.token);
            
            alert('Login Successful!');
            navigate('/'); // Go back to home page

        } catch (err) {
            console.error(err.response.data);
            alert('Login Failed: ' + (err.response.data.msg || 'Server Error'));
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>Sign In</h2>
            <form onSubmit={onSubmit}>
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
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Login</button>
            </form>
        </div>
    );
};

export default Login;