# Same Server Setup Guide

This guide explains how to run both the React frontend and Spring Boot backend on the same server.

## Overview

- **Frontend**: React app running on port 80
- **Backend**: Spring Boot API running on port 8081
- **Proxy**: Vite development server proxies `/api` requests to backend

## Quick Start

### 1. Backend Setup
```bash
cd gfj-be
# Make sure the backend is configured to run on port 8081
# Check application-dev.yml for port configuration
mvn spring-boot:run
```

### 2. Frontend Setup
```bash
cd gfj-ui
# Install dependencies if not already done
npm install

# Start the development server
npm run dev
```

The frontend will be available at: `http://localhost:80`
The backend will be available at: `http://localhost:8081`

## Configuration

### Environment Variables

Create a `.env` file in the `gfj-ui` directory:

```bash
# For same-server setup
VITE_API_URL=http://localhost:8081
VITE_FRONTEND_PORT=80
```

### Vite Configuration

The `vite.config.js` is already configured to:
- Use port 80 for the frontend
- Proxy all `/api` requests to `http://localhost:8081`
- Handle CORS and SSL issues

### Backend CORS Configuration

Make sure your Spring Boot backend allows requests from `http://localhost:80`. Update `SecurityConfig.java`:

```java
.allowedOrigins("http://localhost:80", "http://127.0.0.1:80")
```

## API Request Flow

1. **Frontend makes request**: `apiClient.get('/users')`
2. **Vite proxy intercepts**: Converts to `http://localhost:8081/api/users`
3. **Backend processes**: Spring Boot handles the request
4. **Response returns**: Backend → Vite proxy → Frontend

## Troubleshooting

### Port Conflicts
If port 80 is already in use:
```bash
# Set a different port
VITE_FRONTEND_PORT=3000 npm run dev
```

### Backend Not Accessible
1. Check if backend is running on port 8081
2. Verify CORS configuration allows `http://localhost:80`
3. Check backend logs for errors

### Proxy Issues
1. Check browser console for proxy errors
2. Verify the API_URL in vite.config.js
3. Test backend directly: `curl http://localhost:8081/api/auth/test`

## Production Deployment

For production deployment on the same server:

### 1. Build the Frontend
```bash
cd gfj-ui
npm run build:prod
# or simply: npm run build
```

### 2. Deploy to Spring Boot
- Copy the `dist/` folder contents to your Spring Boot `src/main/resources/static/` directory
- Or configure Spring Boot to serve static files from the build directory

### 3. Configure Spring Boot for Static Files
Add to your `application-prod.yml`:
```yaml
spring:
  web:
    resources:
      static-locations: classpath:/static/,file:./dist/
```

### 4. CORS Configuration
Ensure your Spring Boot backend allows requests from the same origin:
```java
.allowedOrigins("http://localhost", "http://localhost:80", "http://127.0.0.1")
```

### 5. Production Benefits
- **Internal Communication**: Frontend and backend communicate via localhost
- **No External Dependencies**: All traffic stays within the server
- **Better Security**: No external API exposure
- **Improved Performance**: Faster internal network communication

## Development vs Production

### Development (Same Server)
- Frontend: `http://localhost:80`
- Backend: `http://localhost:8081`
- Uses Vite proxy for API calls

### Production (Same Server)
- Frontend: Served as static files by Spring Boot
- Backend: `http://localhost:8081` (internal communication)
- Frontend makes direct API calls to localhost:8081

## Testing the Setup

1. Start the backend:
   ```bash
   cd gfj-be
   mvn spring-boot:run
   ```

2. Start the frontend:
   ```bash
   cd gfj-ui
   npm run dev
   ```

3. Open browser to `http://localhost:80`
4. Check browser console for any errors
5. Test API calls (login, data fetching, etc.)

## Common Issues

### CORS Errors
- Ensure backend CORS configuration includes `http://localhost:80`
- Check that preflight OPTIONS requests are handled

### Connection Refused
- Verify backend is running on port 8081
- Check firewall settings
- Ensure no other service is using port 8081

### SSL Certificate Issues
- For development, the configuration uses `secure: false`
- For production, ensure proper SSL certificates are configured
