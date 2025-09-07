import axios from 'axios';

// Get API URL from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';
const BASE_URL = import.meta.env.DEV ? '/api' : `${API_URL}/api`;

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL, // Use proxy in dev, full URL in production
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_details') 
      ? JSON.parse(localStorage.getItem('user_details')).token 
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request for debugging
    console.log(`[${new Date().toISOString()}] Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[${new Date().toISOString()}] Received ${response.status} from: ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    
    // Don't redirect on 401 during login attempts
    // Let the login component handle the error
    return Promise.reject(error);
  }
);

export default apiClient; 