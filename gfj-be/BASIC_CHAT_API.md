# Basic Chat API

A simple chat API that allows users to send and retrieve messages with username and message content.

## Features

- Send messages with username and content
- Retrieve all messages
- Get recent messages (last 50)
- Get messages by specific username
- Get current user's messages
- Clear all messages (admin function)

## API Endpoints

### 1. Send Message
**POST** `/api/chat/send`

Send a message from the authenticated user.

**Request Body:**
```json
{
  "message": "Hello, this is my message!"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "message": "Hello, this is my message!",
  "sentAt": "2024-01-15T10:30:00"
}
```

### 2. Get All Messages
**GET** `/api/chat/messages`

Retrieve all messages ordered by sent time (newest first).

**Response:**
```json
[
  {
    "id": 2,
    "username": "jane_smith",
    "message": "Hi everyone!",
    "sentAt": "2024-01-15T10:35:00"
  },
  {
    "id": 1,
    "username": "john_doe",
    "message": "Hello, this is my message!",
    "sentAt": "2024-01-15T10:30:00"
  }
]
```

### 3. Get Recent Messages
**GET** `/api/chat/messages/recent`

Retrieve the last 50 messages.

**Response:** Same format as "Get All Messages"

### 4. Get Messages by Username
**GET** `/api/chat/messages/user/{username}`

Retrieve messages from a specific user.

**Response:** Same format as "Get All Messages"

### 5. Get My Messages
**GET** `/api/chat/messages/my`

Retrieve messages from the current authenticated user.

**Response:** Same format as "Get All Messages"

### 6. Clear All Messages
**DELETE** `/api/chat/messages/clear`

Clear all messages (admin function).

**Response:**
```json
{
  "message": "All messages cleared successfully"
}
```

## Database Schema

### ChatMessage Table
```sql
CREATE TABLE chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sent_at DATETIME NOT NULL
);
```

## Authentication

All endpoints require authentication. The username is automatically extracted from the JWT token.

## Usage Examples

### Using cURL

1. **Send a message:**
```bash
curl -X POST http://localhost:8080/api/chat/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message": "Hello world!"}'
```

2. **Get all messages:**
```bash
curl -X GET http://localhost:8080/api/chat/messages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

3. **Get messages from specific user:**
```bash
curl -X GET http://localhost:8080/api/chat/messages/user/john_doe \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using JavaScript/Fetch

```javascript
// Send a message
const sendMessage = async (message) => {
  const response = await fetch('/api/chat/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  });
  return response.json();
};

// Get all messages
const getMessages = async () => {
  const response = await fetch('/api/chat/messages', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK` - Successful GET requests
- `201 Created` - Successful message creation
- `401 Unauthorized` - Missing or invalid authentication
- `400 Bad Request` - Invalid request body
- `500 Internal Server Error` - Server errors

## Notes

- Messages are stored with timestamps automatically set to the current time
- All messages are ordered by sent time (newest first)
- The username is automatically extracted from the JWT token
- No message editing or deletion for individual messages (only clear all)
- Simple text-based messages only (no attachments, formatting, etc.) 