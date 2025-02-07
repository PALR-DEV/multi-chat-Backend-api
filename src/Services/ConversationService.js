import { query } from '../config/postgres-config.js';


class ConversationService {
    
    async createConversation( name = null) {
        const result = await query('INSERT INTO Conversations (type, name) VALUES ($1, $2) RETURNING *', ['one-to-one', name]);
        return result.rows[0];
    }

    async addUserToConversation(conversationId, userId) {
        const result = await query('INSERT INTO ConversationParticipants (conversationid, userid) VALUES ($1, $2) RETURNING *', [conversationId, userId]);
        return result.rows[0];
    }

    async getUserConversations(userId) {
        const result = await query(`
            SELECT 
                c.*,
                array_agg(json_build_object(
                    'userId', u.id,
                    'username', u.username,
                    'firstname', u.firstname,
                    'lastname', u.lastname
                )) as participants
            FROM Conversations c
            JOIN ConversationParticipants cp ON c.id = cp.conversationid
            JOIN Users u ON cp.userid = u.id
            WHERE c.id IN (
                SELECT conversationid 
                FROM ConversationParticipants 
                WHERE userid = $1
            )
            GROUP BY c.id
        `, [userId]);
        
        return result.rows;
    }

    async findOrCreateConversation(userId1, userId2) {
        try {
            // First, check if a conversation already exists between these users
            const existingConversation = await query(`
                SELECT c.id 
                FROM Conversations c
                JOIN ConversationParticipants cp1 ON c.id = cp1.conversationid
                JOIN ConversationParticipants cp2 ON c.id = cp2.conversationid
                WHERE c.type = 'one-to-one'
                AND cp1.userid = $1 
                AND cp2.userid = $2
            `, [userId1, userId2]);

            if (existingConversation.rows.length > 0) {
                return existingConversation.rows[0];
            }

            // If no conversation exists, create a new one
            const newConversation = await this.createConversation();
            
            // Add both users to the conversation
            await this.addUserToConversation(newConversation.id, userId1);
            await this.addUserToConversation(newConversation.id, userId2);
            return newConversation;

        } catch (error) {
            throw error;
        }
    }

    async getConversationParticipants(conversationId) {
        const result = await query(`
            SELECT 
                cp.userid,
                u.username,
                u.firstname,
                u.lastname,
                cp.joinedat
            FROM 
                ConversationParticipants cp
            JOIN 
                Users u ON cp.userid = u.id
            WHERE 
                cp.conversationId = $1
        `, [conversationId]);
    
        return result.rows;
    }

    async searchUsers(searchTerm) {
        const result = await query(`
            SELECT id, username, profile_picture 
            FROM Users 
            WHERE username LIKE '%' || $1 || '%'
        `, [searchTerm]);
        return result.rows;
    }
}
const conversationService = new ConversationService();
export default conversationService;


// CREATE TABLE Conversations (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     type VARCHAR(50) NOT NULL, -- 'one-on-one' or 'group'
//     name VARCHAR(255), -- Optional name for group chats
//     createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
// );