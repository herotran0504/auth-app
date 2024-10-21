import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpUser } from '../services/userService';
import { useTheme } from '../context/ThemeContext';
import { validateImage } from '../utils/imageValidation'; // Import the validation function
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
  const [imageError, setImageError] = useState(null); // State for image error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validationErrors = validateImage(file); // Validate the image

    if (validationErrors.length > 0) {
      setImageError(validationErrors.join(' ')); // Set the image error message
      setFormData({ ...formData, profileImage: null }); // Reset profile image
    } else {
      setImageError(null); // Clear any image error
      setFormData({ ...formData, profileImage: file }); // Set profile image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { email, password, name, profileImage } = formData;

      if (!profileImage) {
        setImageError('Please select a profile image before signing up.');
        return;
      }

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
        <h2 style={{color: theme.primary}}>Sign Up</h2>
        {error && <p style={{color: 'red'}}>{error}</p>}
        {imageError && <p style={{color: 'red'}}>{imageError}</p>} {/* Display image error message */}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '20px'}}>
            <label>Name:</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
            />
          </div>
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
          <div style={{marginBottom: '20px'}}>
            <label>Profile Image:</label>
            <input
                type="file"
                name="profileImage"
                onChange={handleFileChange}
                required
            />
          </div>
          <button
              style={{backgroundColor: theme.primary}}
              type="submit"
              disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div style={{marginTop: '30px'}}>
          <p>
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} style={{color: theme.primary, background: 'none', border: 'none', cursor: 'pointer'}}>
              Log in
            </button>
          </p>
        </div>
      </div>
  );
};

export default SignUp;
