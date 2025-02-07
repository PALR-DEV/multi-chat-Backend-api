# MultiChat Backend API Documentation

## Overview
This documentation provides detailed information about the MultiChat Backend API endpoints, authentication mechanisms, and implementation details.

## Base URL
```
http://localhost:3000/api
```

## Authentication
The API uses JWT (JSON Web Token) for authentication. Most endpoints require a valid JWT token in the Authorization header.

### Token Format
```
Authorization: Bearer <your_jwt_token>
```

### Token Generation
- Tokens are generated upon successful login
- Tokens expire after 1 hour
- Tokens contain user ID, username, and role information

## API Endpoints

### User Management

#### 1. User Registration
```http
POST /api/add-user
```

**Request Body:**
```json
{
  "payload": {
    "username": "string",
    "firstname": "string",
    "lastname": "string",
    "email": "string",
    "passwordHash": "string",
    "userlanguage": "string"
  }
}
```

**Response:**
- Success (201):
```json
{
  "success": true,
  "message": "User added successfully"
}
```
- Error (400) - Email exists:
```json
{
  "success": false,
  "message": "Email already exists",
  "exists": true
}
```

#### 2. User Login
```http
POST /api/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
- Success (200):
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "number",
      "username": "string",
      "email": "string",
      "firstname": "string",
      "lastname": "string",
      "userlanguage": "string"
    },
    "token": "string"
  }
}
```
- Error (401):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### 3. Check Email Availability
```http
POST /api/check-email
```

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
- Available (200):
```json
{
  "success": true,
  "message": "Email is available",
  "exists": false
}
```
- Exists (200):
```json
{
  "success": false,
  "message": "Email already exists",
  "exists": true
}
```

#### 4. Get All Users (Protected)
```http
GET /api/get-users
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
- Success (200):
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": "number",
      "username": "string",
      "email": "string",
      "firstname": "string",
      "lastname": "string",
      "userlanguage": "string"
    }
  ]
}
```

### Conversation Management

#### 1. Create Conversation
```http
POST /api/create-conversation
```

**Response:**
- Success (200):
```json
{
  "message": "Conversation created successfully",
  "data": {
    "id": "number",
    "created_at": "timestamp"
  }
}
```

#### 2. Add User to Conversation
```http
POST /api/add-user-to-conversation
```

**Request Body:**
```json
{
  "conversationID": "number",
  "userID": "number"
}
```

**Response:**
- Success (200):
```json
{
  "message": "User added to conversation successfully",
  "data": {
    "conversationID": "number",
    "userID": "number"
  }
}
```
- Error (400) - User already in conversation:
```json
{
  "message": "User is already a participant in this conversation",
  "data": null
}
```

#### 3. Get Conversation Participants
```http
GET /api/get-conversation-participants/:conversationID
```

**Response:**
- Success (200):
```json
{
  "message": "Conversation participants fetched successfully",
  "data": [
    {
      "userID": "number",
      "username": "string"
    }
  ]
}
```

## Implementation Details

### Database Schema

#### Users Table
```sql
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    passwordhash VARCHAR(255) NOT NULL,
    userlanguage VARCHAR(50) NOT NULL
);
```

### Security Measures
1. JWT Authentication
   - Tokens expire after 1 hour
   - Secured routes using middleware
   - Token verification on protected endpoints

2. Password Security
   - TODO: Implement password hashing
   - Currently stored as plain text (needs improvement)

### Technologies Used
- Node.js
- Express.js
- PostgreSQL
- JSON Web Tokens (JWT)
- CORS enabled
- Body Parser for JSON handling

### Environment Variables
Required environment variables in `.env` file:
```
PORT=3000
JWT_SECRET=your_jwt_secret
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_NAME=your_db_name
```

## Error Handling
The API implements consistent error handling across all endpoints:

- 200: Successful operation
- 201: Resource created successfully
- 400: Bad request / Invalid input
- 401: Unauthorized / Invalid credentials
- 500: Internal server error

## Future Improvements
1. Implement password hashing
2. Add message handling in conversations
3. Implement real-time chat functionality
4. Add user profile management
5. Implement file sharing in conversations