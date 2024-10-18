import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpUser } from '../services/userService';
import { useTheme } from '../context/ThemeContext';
import '../App.css';

const SignUp = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { email, password, name, profileImage } = formData;

      await signUpUser({ email, password, name, profileImage });

      navigate('/login');
    } catch (error) {
      console.error('Error during sign up:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container">
        <h2 style={{ color: theme.primary }}>Sign Up</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label>Name:</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label>Email:</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label>Password:</label>
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label>Profile Image:</label>
            <input
                type="file"
                name="profileImage"
                onChange={handleFileChange}
            />
          </div>
          <button
              style={{ backgroundColor: theme.primary }}
              type="submit"
              disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
  );
};

export default SignUp;
