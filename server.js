import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import postgres from './src/config/postgres-config.js';
import jwt from 'jsonwebtoken';

// Import routes
import UserRoutes from './src/routes/UserRoutes.js'
import ConversationRoute from './src/routes/conversationRoutes.js'
import MessageRoute from './src/routes/messageRoutes.js'
import ValidateTokenRoute from './src/routes/validateTokenRoute.js'




// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS




// Routes
app.use('/api', UserRoutes);
app.use('/api', ConversationRoute);
app.use('/api', ValidateTokenRoute);
app.use('/api', MessageRoute);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});