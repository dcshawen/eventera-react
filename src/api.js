import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Proxy will handle the host
});

export default api;
