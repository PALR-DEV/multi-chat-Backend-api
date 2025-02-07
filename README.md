# MultiChat Backend 🚀

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)

A robust and scalable backend API for a modern chat application, built with Node.js, Express, and PostgreSQL. This project implements secure user authentication with password hashing, real-time messaging capabilities, and comprehensive conversation management.

## 🌟 Features

- **Secure Authentication** with JWT tokens and password hashing
- **Conversation Management** for private chats
- **Real-time Messaging** capabilities
- **User Profile Management** with profile image support
- **RESTful API** design
- **PostgreSQL** database for reliable data storage

## 🛠️ Tech Stack

- **Backend Framework**: Node.js + Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: Password hashing, CORS enabled
- **Request Parsing**: Body Parser for JSON handling

## 🚀 Getting Started

### Prerequisites

- Node.js (v12 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/MultiChatBackend.git
cd MultiChatBackend
```

2. Install dependencies
```bash
yarn install
# or
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
PORT=3000
```

4. Run database migrations
```bash
psql -U your_db_user -d your_db_name -f multichat.sql
```

5. Start the server
```bash
yarn start
# or
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

#### Token Details
- Tokens expire after 5 hours
- Contains user ID, username, and role information
- Generated upon successful login
- Secured with robust hashing algorithms

### API Endpoints

#### 1. User Management
- `POST /api/register` - Register new user (with password hashing)
- `POST /api/login` - User login
- `GET /api/validate-token` - Validate JWT token
- `GET /api/profile` - Get user profile

#### 2. Conversation Management
- `POST /api/create-conversation` - Create new conversation
- `GET /api/conversations` - List user conversations
- `GET /api/conversation/:id` - Get conversation details

#### 3. Messaging
- `POST /api/messages` - Send message
- `GET /api/messages/:conversationId` - Get conversation messages

### Error Handling

The API implements consistent error responses:

- `200` - Successful operation
- `201` - Resource created successfully
- `400` - Bad request / Invalid input
- `401` - Unauthorized / Invalid credentials
- `500` - Internal server error

## 🔒 Security Features

1. **JWT Authentication**
   - Secure token-based authentication with 5-hour expiration
   - Protected routes using middleware
   - Token verification on all protected endpoints

2. **Password Security**
   - Robust password hashing implementation
   - Secure storage practices
   - Protection against common security vulnerabilities

## 🔄 Project Structure

```
├── src/
│   ├── Services/
│   │   ├── AuthService.js
│   │   ├── ConversationService.js
│   │   ├── MessagesServices.js
│   │   └── ProfileImageService.js
│   ├── config/
│   │   ├── authMiddleware.js
│   │   ├── jwtUtils.js
│   │   └── postgres-config.js
│   └── routes/
│       ├── UserRoutes.js
│       ├── conversationRoutes.js
│       ├── messageRoutes.js
│       └── validateTokenRoute.js
├── server.js
└── multichat.sql
```

## 🚀 Future Improvements

1. 📁 File sharing in conversations
2. 👥 Advanced group chat management
3. 🔍 Message search functionality
4. 📱 Push notifications support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for modern chat applications