// Environment Configuration for GFJ Frontend
// Copy this file to config.js and update the values as needed

export const config = {
  // API Configuration
  // For same-server setup (both frontend and backend on same machine)
  // This works for both development and production
  API_URL: 'http://localhost:8081',
  
  // For remote server setup (backend on different server) - development only
  // API_URL: 'http://13.203.103.15:8081',
  
  // For HTTPS setup (if backend uses SSL) - development only
  // API_URL: 'https://13.203.103.15:8081',
  
  // Frontend Port (optional, defaults to 80)
  FRONTEND_PORT: 80,
  
  // Timeout for API requests (in milliseconds)
  API_TIMEOUT: 10000,
  
  // Enable debug logging
  DEBUG: true
};

export default config;
