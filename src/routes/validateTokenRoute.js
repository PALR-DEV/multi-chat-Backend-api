import express from 'express';
import jwt from 'jsonwebtoken'; // Add this import
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();


router.get('/validate-token', async(req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Remove 'Bearer ' if present
    const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    try {
        // Verify the token using your secret key
        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
        
        // Token is valid and not expired
        return res.status(200).json({ 
            success: true, 
            message: 'Token is valid',
            user: decoded 
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token has expired' 
            });
        }
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
});

export default router;