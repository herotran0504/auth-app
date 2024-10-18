import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext'; // Ensure correct import path
import '../App.css';

const Profile = () => {
    const theme = useTheme(); // Get the current theme
    const [userData, setUserData] = useState({
        email: 'user@example.com',
        name: 'John Doe',
        profileImage: 'https://pyxis.nymag.com/v1/imgs/51b/28a/622789406b8850203e2637d657d5a0e0c3-avatar-rerelease.rhorizontal.w700.jpg',
    });

    const [newImage, setNewImage] = useState(null);

    const handleFileChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newImage) {
            const newImageUrl = URL.createObjectURL(newImage);
            setUserData({ ...userData, profileImage: newImageUrl });
            console.log('Image uploaded:', newImage);
        }
    };

    return (
        <div className="container">
            <h2 style={{ color: theme.primary }}>Profile</h2>
            <div style={{ textAlign: 'center' }}>
                {userData.profileImage ? (
                    <img
                        src={userData.profileImage}
                        alt="Profile"
                        style={{ width: '150px', height: '150px', borderRadius: '75px', objectFit: 'cover' }}
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
