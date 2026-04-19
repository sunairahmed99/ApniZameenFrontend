import axios from 'axios';
import { API_BASE_URL } from '../config'; // Ensure accurate path to config

// Configure default axios instance
axios.defaults.baseURL = API_BASE_URL;

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            // Network error (server down, no internet, CORS issues)
            const event = new Event('network-error');
            window.dispatchEvent(event);
        } else if (error.response.status === 401) {
            if (error.response.data && error.response.data.message && error.response.data.message.includes('jwt expired')) {
                localStorage.removeItem('user');
                localStorage.removeItem('seller');
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export default axios;
