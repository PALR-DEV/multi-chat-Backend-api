import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '5h' }  // Token expires in 1 hour
    );
};

// Verify JWT
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;  // Invalid token
    }
};

export { generateToken, verifyToken };