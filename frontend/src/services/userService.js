import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const userService = {
    // Basic list endpoint (assuming /api/auth/users/ exists or will be added)
    list: async (params = {}) => {
        const res = await api.get('/api/auth/users/', { params });
        return res.data;
    },
    // Update user
    update: async (id, data) => {
        const res = await api.patch(`/api/auth/users/${id}/`, data);
        return res.data;
    },
    // Delete user
    remove: async (id) => {
        const res = await api.delete(`/api/auth/users/${id}/`);
        return res.data;
    },
};

export default userService;