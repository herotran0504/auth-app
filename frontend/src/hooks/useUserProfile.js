import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const useUserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_ENDPOINTS.PROFILE, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return { userData, refetchUserData: fetchUserData, loading };
};

export default useUserProfile;

