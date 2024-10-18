import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.js';

export const signUpUser = async (formData) => {
    const { email, password, name, profileImage } = formData;

    const data = {
        email,
        password,
        name,
        fileName: profileImage?.name || null,
    };

    const response = await axios.post(API_ENDPOINTS.SIGNUP, data);

    if (profileImage) {
        const { preSignedUrl } = response.data;
        await axios.put(preSignedUrl, profileImage, {
            headers: {
                'Content-Type': profileImage.type,
            },
        });
    }

    return response;
};

export const loginUser = async (formData) => {
    return await axios.post(API_ENDPOINTS.LOGIN, formData);
};

export const uploadImage = async (token, fileName, file) => {
    const response = await axios.post(API_ENDPOINTS.UPLOAD_IMAGE, { fileName }, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const preSignedUrl = response.data.preSignedUrl;

    await axios.put(preSignedUrl, file, {
        headers: {
            'Content-Type': file.type,
        },
    });
};