import axios from 'axios';

// Dynamic API URL detection based on current host
const getApiUrl = () => { 
  const currentHost = window.location.hostname;
  const currentProtocol = window.location.protocol;
  const apiPort = '8081';
  return `${currentProtocol}//${currentHost}:${apiPort}`;
};

const API_URL = getApiUrl();

// Determine if we should use proxy or direct API callsgit stash
// Use proxy when:
// 1. In development mode (Vite dev server)
// 2. When frontend and backend are on the same server (same hostname)
const shouldUseProxy = import.meta.env.DEV || 
  (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

const BASE_URL = shouldUseProxy ? '/api' : `${API_URL}/api`;

// Debug logging for API URL detection
console.log('🔧 API Configuration:', {
  currentHost: window.location.hostname,
  currentProtocol: window.location.protocol,
  currentPort: 8081,
  detectedApiUrl: API_URL,
  baseUrl: BASE_URL,
  shouldUseProxy: shouldUseProxy,
  isDev: import.meta.env.DEV,
  viteApiUrl: import.meta.env.VITE_API_URL
});

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