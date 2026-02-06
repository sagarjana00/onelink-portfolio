import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',   // your FastAPI backend
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  },
});

// Important: default export
export default api;