import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import axios from 'axios';
import '../App.css';

const SignUp = () => {
  const theme = useTheme(); // Get the current theme
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    profileImage: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Send user data to the backend (without image)
      const { data } = await axios.post('http://localhost:5050/dev/signup', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        fileName: formData.profileImage.name
      });

      const { preSignedUrl, imageKey } = data;

      // Step 2: Upload the image to S3 using the pre-signed URL
      if (formData.profileImage && preSignedUrl) {
        await axios.put(preSignedUrl, formData.profileImage, {
          headers: {
            'Content-Type': formData.profileImage.type
          }
        });

        console.log('Image uploaded successfully!');
      }

      navigate('/login');
    } catch (err) {
      console.error('Error during sign up:', err);
    }
  };

  return (
      <div className="container">
        <h2 style={{ color: theme.primary }}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div>
            <label>Profile Image:</label>
            <input type="file" name="profileImage" onChange={handleFileChange} />
          </div>
          <button style={{ backgroundColor: theme.primary }} type="submit">Sign Up</button>
        </form>
      </div>
  );
};

export default SignUp;
