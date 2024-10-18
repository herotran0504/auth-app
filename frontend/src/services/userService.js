import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.js';

export const uploadImage = async (token, fileName, file) => {
    // Step 1: Request a pre-signed URL from the backend
    const response = await axios.post(API_ENDPOINTS.UPLOAD_IMAGE, { fileName }, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const preSignedUrl = response.data.preSignedUrl;

    // Step 2: Upload the image to S3 using the pre-signed URL
    await axios.put(preSignedUrl, file, {
        headers: {
            'Content-Type': file.type,
        },
    });
};