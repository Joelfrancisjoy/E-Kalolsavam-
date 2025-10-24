import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const http = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to include the auth token
http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle auth errors with refresh
http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refresh = localStorage.getItem('refresh_token');
            if (refresh) {
                try {
                    const res = await axios.post(`${API_URL}/api/token/refresh/`, { refresh });
                    const newAccess = res.data?.access;
                    if (newAccess) {
                        localStorage.setItem('access_token', newAccess);
                        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                        return http.request(originalRequest);
                    }
                } catch (e) {
                    // fall through to logout below
                }
            }
            // No refresh token or refresh failed
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default http;
