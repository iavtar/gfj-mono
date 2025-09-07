// Environment Configuration for GFJ Frontend
// Same-server deployment configuration

export const config = {
  // API Configuration
  // For same-server setup (both frontend and backend on same machine)
  // This works for both development and production
  API_URL: 'http://localhost:8081',
  
  // Frontend Port (optional, defaults to 80)
  FRONTEND_PORT: 80,
  
  // Timeout for API requests (in milliseconds)
  API_TIMEOUT: 10000,
  
  // Enable debug logging
  DEBUG: true
};

export default config;
