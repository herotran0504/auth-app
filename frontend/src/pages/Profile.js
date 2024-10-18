import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import axios from 'axios';
import '../App.css';

const Profile = () => {
    const theme = useTheme(); // Get the current theme
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [newImage, setNewImage] = useState(null); // State for new image
    const [uploading, setUploading] = useState(false); // State for uploading

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await axios.get('http://localhost:5050/dev/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]); // Get the selected image
    };

    const handleImageUpload = async () => {
        if (!newImage) return; // If no new image selected, do nothing

        setUploading(true); // Set uploading state

        try {
            const token = localStorage.getItem('token');

            // Get a pre-signed URL from the backend
            const response = await axios.post('http://localhost:5050/dev/get-presigned-url', {
                filename: newImage.name,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { url } = response.data; // Get the pre-signed URL

            // Upload the image to S3 using the pre-signed URL
            await axios.put(url, newImage, {
                headers: {
                    'Content-Type': newImage.type, // Set the content type
                },
            });

            // After successful upload, fetch the updated profile data
            const profileResponse = await axios.get('http://localhost:5050/dev/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUserData(profileResponse.data); // Update user data
            setNewImage(null); // Reset new image state
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setUploading(false); // Reset uploading state
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
            <div>
                <img src={userData.profileImage} alt="Profile" width="100" />
                <h3>Name: {userData.name}</h3>
                <p>Email: {userData.email}</p>
            </div>
            <div>
                <input type="file" onChange={handleImageChange} />
                <button
                    style={{ backgroundColor: theme.primary }}
                    onClick={handleImageUpload}
                    disabled={uploading} // Disable button while uploading
                >
                    {uploading ? 'Uploading...' : 'Change Image'}
                </button>
            </div>
        </div>
    );
};

export default Profile;
