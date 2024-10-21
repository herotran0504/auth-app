const API_URLS = {
    //BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5050/dev',
    BASE_URL:'http://localhost:5050/dev'
};
export const API_ENDPOINTS = {
    LOGIN: `${API_URLS.BASE_URL}/login`,
    SIGNUP: `${API_URLS.BASE_URL}/signup`,
    PROFILE: `${API_URLS.BASE_URL}/profile`,
    UPLOAD_IMAGE: `${API_URLS.BASE_URL}/upload-image`,
};
