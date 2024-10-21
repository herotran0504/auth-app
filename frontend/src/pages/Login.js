import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/userService';
import { useTheme } from '../context/ThemeContext';
import '../App.css';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser(formData);
      console.log('Login successful:', response.data);

      localStorage.setItem('token', response.data.token);

      navigate('/profile');
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container">
        <h2 style={{color: theme.primary}}>Login</h2>
        {error && <p style={{color: 'red'}}>{error}</p>} {/* Display error message */}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '20px'}}>
            <label>Email:</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
          </div>
          <div style={{marginBottom: '20px'}}>
            <label>Password:</label>
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />
          </div>
          <button
              style={{backgroundColor: theme.primary}}
              type="submit"
              disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div style={{marginTop: '30px'}}>
          <p>
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')} style={{color: theme.primary, background: 'none', border: 'none', cursor: 'pointer'}}>
              Sign up
            </button>
          </p>
        </div>
      </div>
  );
};

export default Login;
