# CORS Configuration Setup

## Overview
This document explains the CORS (Cross-Origin Resource Sharing) configuration for the GemsFromJaipur backend application.

## Changes Made

### 1. Updated SecurityConfig.java
- Integrated CORS configuration directly into Spring Security
- Added proper CORS filter chain to handle preflight requests correctly
- Configured specific allowed origins, methods, and headers
- Ensured OPTIONS requests are handled properly

### 2. Removed Conflicting Annotations
- Removed all `@CrossOrigin(origins = "*")` annotations from controllers
- This prevents conflicts with the global CORS configuration

### 3. Simplified Configuration
- Removed complex property-based configuration to avoid startup issues
- CORS configuration is now hardcoded in SecurityConfig for reliability

## Allowed Origins
Currently configured for development:
- `http://localhost:5173` (React dev server)
- `http://localhost:3000` (Alternative React dev server)
- `http://127.0.0.1:5173` (Alternative localhost)
- `http://127.0.0.1:3000` (Alternative localhost)

## Allowed Methods
- GET, POST, PUT, DELETE, OPTIONS, PATCH

## Allowed Headers
- Authorization, Content-Type, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers

## Testing CORS

### 1. Test Endpoint
A test endpoint has been added at: `GET /api/auth/test`

### 2. Testing from Browser Console
```javascript
// Test the CORS endpoint
fetch('http://13.203.103.15:8080/api/auth/test', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.text())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

### 3. Testing Sign-in Endpoint
```javascript
fetch('http://13.203.103.15:8080/api/auth/signin', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'test',
    password: 'test'
  })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

## SSL Configuration Note
The application is currently configured to use SSL (HTTPS) on port 8080. If you're accessing it via HTTP, you may need to:

1. Either change your frontend to use HTTPS
2. Or temporarily disable SSL for development by modifying `application-dev.yml`:

```yaml
server:
  port: 8080
  ssl:
    enabled: false
```

## Troubleshooting

### Common Issues:
1. **Preflight fails**: Ensure OPTIONS method is allowed
2. **Credentials not sent**: Ensure `allowCredentials: true` and specific origins (not wildcard)
3. **Headers blocked**: Ensure all required headers are in `allowedHeaders`
4. **SSL mismatch**: Ensure both frontend and backend use same protocol (HTTP/HTTPS)

### Debug Steps:
1. Check browser console for CORS errors
2. Verify the server is running and accessible
3. Test with the `/api/auth/test` endpoint first
4. Check network tab for preflight requests
5. Verify SSL configuration matches your access method

## Production Deployment
For production, update the allowed origins in `SecurityConfig.java` to include your actual frontend domain(s).

## Configuration Location
The CORS configuration is now located in:
- `src/main/java/com/iavtar/gfj_be/security/SecurityConfig.java` - Main CORS configuration
- `src/main/java/com/iavtar/gfj_be/config/AppConfig.java` - Only contains password encoder 