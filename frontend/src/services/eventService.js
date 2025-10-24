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
    // Events (read-only for dashboard usage)
    listEvents: async (params = {}) => {
        const res = await api.get('/api/events/', { params });
        return res.data;
    },
    getEvent: async (id) => {
        const res = await api.get(`/api/events/${id}/`);
        return res.data;
    },
    createEvent: async (payload) => {
        const res = await api.post('/api/events/', payload);
        return res.data;
    },
    updateEvent: async (id, payload) => {
        const res = await api.patch(`/api/events/${id}/`, payload);
        return res.data;
    },
    deleteEvent: async (id) => {
        const res = await api.delete(`/api/events/${id}/`);
        return res.data;
    },
    assignVolunteers: async (id, volunteerIds) => {
        const res = await api.post(`/api/events/${id}/assign-volunteers/`, { volunteer_ids: volunteerIds });
        return res.data;
    },
    publishEvent: async (id, isPublished) => {
        const res = await api.patch(`/api/events/${id}/`, { is_published: isPublished });
        return res.data;
    },
    togglePublish: async (id) => {
        const res = await api.patch(`/api/events/${id}/toggle-publish/`);
        return res.data;
    },

    // Student-specific: dedicated endpoint for published events
    listPublishedEvents: async (params = {}) => {
        const res = await api.get('/api/events/published/', { params });
        return res.data;
    },
    // Judge-specific helpers
    listMyAssignedEvents: async () => {
        const res = await api.get('/api/events/my-assigned/');
        return res.data;
    },
    listParticipantsForEvent: async (eventId) => {
        const res = await api.get(`/api/events/${eventId}/participants/`);
        return res.data;
    },
    getParticipantByChessNumber: async (chessNumber, eventId) => {
        const res = await api.get(`/api/events/${eventId}/participants/?chess_number=${chessNumber}`);
        return res.data;
    },
    
    listMyRegistrations: async () => {
        const res = await api.get('/api/events/my-registrations/');
        return res.data;
    },

    registerForEvent: async (eventId, firstName, lastName) => {
        const res = await api.post('/api/events/registrations/', {
            event: eventId,
            first_name: firstName,
            last_name: lastName
        });
        return res.data;
    },

    // Venues (read-only here)
    listVenues: async () => {
        const res = await api.get('/api/events/venues/');
        return res.data;
    },
};

export default eventService;