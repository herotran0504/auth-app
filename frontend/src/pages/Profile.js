import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import '../App.css';

const Profile = () => {
    const theme = useTheme();
    const [userData, setUserData] = useState({ profileImage: '', name: '', email: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5050/dev/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleFileChange = (event) => {
        // Logic to handle file change
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Logic to update the image
    };

    return (
        <div className="container">
            <h2 style={{ color: theme.primary }}>Profile</h2>
            <div style={{ textAlign: 'center' }}>
                {userData.profileImage ? (
                    <img
                        src={userData.profileImage}
                        alt="Profile"
                        style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '75px',
                            objectFit: 'cover',
                            border: `2px solid ${theme.primary}`,
                        }}
                    />
                ) : (
                    <div style={{ width: '150px', height: '150px', borderRadius: '75px', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        No Image
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={userData.name} readOnly />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={userData.email} readOnly />
                </div>
                <div>
                    <label>Change Profile Image:</label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button style={{ backgroundColor: theme.primary }} type="submit">Update Image</button>
            </form>
        </div>
    );
};

export default Profile;
