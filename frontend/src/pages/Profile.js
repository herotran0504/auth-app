import React, {useState} from 'react';
import {useTheme} from '../context/ThemeContext';
import {uploadImage} from '../services/userService';
import useUserProfile from '../hooks/useUserProfile';
import '../App.css';

const Profile = () => {
    const theme = useTheme();
    const {userData, refetchUserData, loading} = useUserProfile();
    const [newImage, setNewImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    const handleImageUpload = async () => {
        if (!newImage) return;

        setUploading(true);

        try {
            const token = localStorage.getItem('token');
            await uploadImage(token, newImage.name, newImage);

            await refetchUserData();
        } catch (error) {
            console.error('Error uploading image:', error);
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
            <h2 style={{color: theme.primary}}>Profile</h2>
            <div style={{textAlign: 'center', marginBottom: '30px'}}>
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
            <div style={{marginBottom: '20px'}}>
                <h3>Name: {userData.name}</h3>
            </div>
            <div style={{marginBottom: '20px'}}>
                <p>Email: {userData.email}</p>
            </div>
            <div>
                <input type="file" onChange={handleImageChange} style={{marginBottom: '10px'}}/>
                <button
                    style={{backgroundColor: theme.primary}}
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
