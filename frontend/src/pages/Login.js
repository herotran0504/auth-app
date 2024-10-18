import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import '../App.css';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate(); // To navigate to other pages
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5050/dev/login', formData); // Change port if needed
      console.log('Login successful:', response.data);

      // Store token in local storage (or any state management solution)
      localStorage.setItem('token', response.data.token);

      // Navigate to profile page after successful login
      navigate('/profile');
    } catch (error) {
      console.error('Login failed:', error.response.data.message);
      alert('Login failed: ' + error.response.data.message);
    }
  };

  return (
      <div className="container">
        <h2 style={{ color: theme.primary }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button style={{ backgroundColor: theme.primary }} type="submit">Login</button>
        </form>
      </div>
  );
};

export default Login;
