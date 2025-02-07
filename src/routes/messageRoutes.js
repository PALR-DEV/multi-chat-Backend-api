import express from 'express';
import messagesServcie from '../Services/MessagesServices.js';
import authenticateToken from '../config/authMiddleware.js';
const router = express.Router();


router.get('/get-messages/:conversationID', authenticateToken, async(req,res) => {
    const conversationID = req.params.conversationID;
    const messages = await messagesServcie.getMessages(conversationID);
    if(messages.length > 0) {
        res.status(200).json({
            message:"Messages fetched successfully",
            success: true,
            data: messages,
            count: messages.length
        });
    } else {
        res.status(404).json({message: 'No messages found', data:[]});
    }
})

router.post('/add-messages', authenticateToken, async(req,res) => {
    try {
        const { payload } = req.body;
        
        if (!payload) {
            return res.status(400).json({
                success: false,
                message: 'Payload is required',
                data: null
            });
        }

        const message = await messagesServcie.addMessage(
            payload.content, 
            payload.senderid, 
            payload.conversationid, 
        );

        if(message) {
            return res.status(200).json({
                success: true,
                message: 'Message added successfully',
                data: message
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Message not added',
                data: null
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
})

export default router;
