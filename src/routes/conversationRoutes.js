import express from 'express';
import authService from '../Services/AuthService.js';
import conversationService from '../Services/ConversationService.js';
import authenticateToken from '../config/authMiddleware.js';
const router = express.Router();


//TODO: i need to add like a request table in postgres when the user want to message somoneelse it can send a request to the other user and if the other user declines then we delete the request or maybe have like a temp conversation but better off with the request and if the user accepts the request we just delete the request the request data will store the requested id and the requesterer id for example senpai's id and elizabeth'id and if the user accepts the request we just create a conversation like normal and add user id 1 and user id 2 as participants and the rest is history 



router.post('/create-conversation', authenticateToken, async(req, res) => {
    try {
        const { otherUserId } = req.body;
        const currentUserId = req.user.id;

        if (!otherUserId) {
            return res.status(400).json({
                success: false,
                message: "Other user ID is required"
            });
        }

        const result = await conversationService.findOrCreateConversation(currentUserId, otherUserId);
        res.status(200).json({
            success: true,
            message: "Conversation created or retrieved successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating/retrieving conversation",
            error: error.message
        });
    }
});

router.post('/add-user-to-conversation',authenticateToken, async(req,res) => {
    try {
        const {conversationID, userID} = req.body;
        
        // Check if user is already in conversation
        const participants = await conversationService.getConversationParticipants(conversationID);
        const isUserAlreadyInConversation = participants.some(participant => participant.userID === userID);
        
        if (isUserAlreadyInConversation) {
            return res.status(400).json({
                message: "User is already a participant in this conversation",
                data: null
            });
        }

        const result = await conversationService.addUserToConversation(conversationID, userID);
        res.status(200).json({
            message: "User added to conversation successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding user to conversation",
            error: error.message
        });
    }
});

router.get('/get-conversation-participants/:conversationID', authenticateToken, async(req, res) => {
    try {
        const conversationID = req.params.conversationID;
        const currentUserId = req.user.id; // Get the current user's ID from the auth token

        const participants = await conversationService.getConversationParticipants(conversationID);
        
        // Filter out the current user from the participants list
        const otherParticipants = participants.filter(participant => participant.userid !== currentUserId);

        res.status(200).json({
            success: true,
            message: "Conversation participants fetched successfully",
            data: otherParticipants
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching conversation participants",
            error: error.message
        });
    }
});

router.get('/get-user-conversations', authenticateToken, async(req, res) => {
    try {
        const userID = req.user.id; // Get user ID from auth token
        const conversations = await conversationService.getUserConversations(userID);
        
        if (!conversations || conversations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No conversations found for this user",
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Conversations retrieved successfully",
            data: conversations
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving conversations",
            error: error.message
        });
    }
});


router.post('/search-user', authenticateToken, async(req,res) => {
    try {
        const searchQuery = req.query.searchQuery;
        await conversationService.searchUsers(searchQuery).then((result) => {
            if(result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No users found",
                    data:[]
                })
            }

            return res.status(200).json({
                success: true,
                data: result
            })
        }).catch((error) => {
            throw error;
        })
        
    } catch (error) {
        throw error;
        
    }
})


router.put('/update-status', authenticateToken, async (req,res) => {
    try {
        const userID = req.user.id;
        const {status} = req.body; // can be online or offline

        const result = await conversationService.updateUserStatus(userID, status);
        
    } catch (error) {
        
    }
})


router.get('/get-user-status/:userID', authenticateToken, async(req,res) => {
    try {
        const userID = req.params.userID;
        const result = await conversationService.getUserStatus(userID);

        if(!result) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null
            })
        }

        return res.status(200).json({
            success: true,
            message: "User status retrieved successfully",
            data: result
        })
        
    } catch (error) {
        throw error;
        
    }
})

export default router;

