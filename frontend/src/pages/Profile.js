import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import '../App.css';

const Profile = () => {
    const theme = useTheme();
    const [userData, setUserData] = useState({ profileImage: '', name: '', email: '' });
    const [selectedFile, setSelectedFile] = useState(null);

    // Define fetchProfile function outside of useEffect
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

    useEffect(() => {
        fetchProfile(); // Call fetchProfile inside useEffect
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const fileName = selectedFile.name;

            // Step 1: Request a pre-signed URL from the backend
            const response = await axios.post('http://localhost:5050/dev/upload-image', {
                fileName: fileName,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const preSignedUrl = response.data.preSignedUrl;

            // Step 2: Upload the image to S3 using the pre-signed URL
            await axios.put(preSignedUrl, selectedFile, {
                headers: {
                    'Content-Type': selectedFile.type,
                },
            });

            // Step 3: Fetch updated user profile data
            fetchProfile(); // Now this will work since fetchProfile is defined
        } catch (error) {
            console.error('Error updating profile image:', error);
        }
    };

    return (
        <div className="container">
            <h2 style={{ color: theme.primary }}>Profile</h2>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
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
                            marginBottom: '30px',
                        }}
                    />
                ) : (
                    <div style={{ width: '150px', height: '150px', borderRadius: '75px', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
                        No Image
                    </div>
                )}
            </div>
            <div style={{ marginBottom: '30px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <strong>Name:</strong> {userData.name}
                </div>
                <div>
                    <strong>Email:</strong> {userData.email}
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '30px' }}> {/* Increased space above the button */}
                    <label>Change Profile Image:</label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button style={{ backgroundColor: theme.primary }} type="submit">Update Image</button>
            </form>
        </div>
    );
};

export default Profile;
