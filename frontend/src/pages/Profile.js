import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { uploadImage } from '../services/userService';
import useUserProfile from '../hooks/useUserProfile';
import { validateImage } from '../utils/imageValidation'; // Import the validation function
import '../App.css';

const Profile = () => {
    const theme = useTheme();
    const { userData, refetchUserData, loading } = useUserProfile();
    const [newImage, setNewImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const validationErrors = validateImage(file); // Validate the image

        if (validationErrors.length > 0) {
            setError(validationErrors.join(' ')); // Set the error message
            setNewImage(null); // Reset new image
        } else {
            setError(null); // Clear any error
            setNewImage(file); // Set the new image state
        }
    };

    const handleImageUpload = async () => {
        if (!newImage) {
            setError('Please select a profile image before updating.');
            return;
        }

        setUploading(true);

        try {
            const token = localStorage.getItem('token');
            await uploadImage(token, newImage.name, newImage);
            await refetchUserData();
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>No user data found.</div>;
    }

    return (
        <div className="container">
            <h2 style={{ color: theme.primary }}>Profile</h2>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <img
                    src={userData.profileImage}
                    alt="Profile"
                    style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `3px solid ${theme.primary}`,
                        marginBottom: '20px',
                    }}
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <h3>Name: {userData.name}</h3>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <p>Email: {userData.email}</p>
            </div>
            <div>
                <input
                    type="file"
                    onChange={handleImageChange}
                    style={{ marginBottom: '10px' }}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button
                    style={{ backgroundColor: theme.primary }}
                    onClick={handleImageUpload}
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Change Image'}
                </button>
            </div>
        </div>
    );
};

export default Profile;
