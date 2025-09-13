import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Axios instance with auth + refresh like allowedEmailService
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, { refresh: refreshToken });
                    const newToken = response.data.access;
                    localStorage.setItem('access_token', newToken);
                    error.config.headers.Authorization = `Bearer ${newToken}`;
                    return api.request(error.config);
                } catch (refreshError) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            } else {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

const eventService = {
    // Events
    listEvents: async (params = {}) => {
        const res = await api.get('/api/events/', { params });
        return res.data;
    },
    getEvent: async (id) => {
        const res = await api.get(`/api/events/${id}/`);
        return res.data;
    },
    createEvent: async (data) => {
        const res = await api.post('/api/events/', data);
        return res.data;
    },
    updateEvent: async (id, data) => {
        const res = await api.patch(`/api/events/${id}/`, data);
        return res.data;
    },
    deleteEvent: async (id) => {
        const res = await api.delete(`/api/events/${id}/`);
        return res.data;
    },

    // Venues
    listVenues: async () => {
        const res = await api.get('/api/events/venues/');
        return res.data;
    },
    createVenue: async (data) => {
        const res = await api.post('/api/events/venues/', data);
        return res.data;
    },
    updateVenue: async (id, data) => {
        const res = await api.patch(`/api/events/venues/${id}/`, data);
        return res.data;
    },
    deleteVenue: async (id) => {
        const res = await api.delete(`/api/events/venues/${id}/`);
        return res.data;
    },
};

export default eventService;