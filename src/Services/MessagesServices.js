import { query } from '../config/postgres-config.js';

class MessagesService {

    async getMessages(conversationID) {
        try {
            const getMessages = await query(
                `
                    SELECT 
                        id,
                        content,
                        sentat,
                        senderid,
                        isread
                    FROM Messages 
                    WHERE conversationid = $1
                    ORDER BY sentat ASC
                `,
                [conversationID]
            );
            return getMessages.rows;

        } catch (error) {
            throw error;
        }
    }

    async addMessage(content, senderID, conversationID) {
        try {
            const addMessage = await query(
                `
                    INSERT INTO Messages (content, senderid, conversationid)
                    VALUES ($1, $2, $3)
                    RETURNING *
                `,
                [content, senderID, conversationID]
            );

            return addMessage.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async markMessageAsRead(messageID) {
        try {
            const markMessageAsRead = await query(
                `
                    UPDATE Messages
                    SET isread = true
                    WHERE id = $1
                    RETURNING *
                `,
                [messageID]
            );
            return markMessageAsRead.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async getUnreadMessagesCount(conversationID) {
        try {
            const getUnreadMessagesCount = await query(
                `
                    SELECT COUNT(*)
                    FROM Messages
                    WHERE conversationid = $1 AND isread = false
                `,
                [conversationID]
            );
            return getUnreadMessagesCount.rows[0].count;
        } catch (error) {
            throw error;
        }
    }

    async deleteMessage(messageID) {
        try {
            const deleteMessage = await query(
                `
                    DELETE FROM Messages
                    WHERE id = $1
                    RETURNING *
                `,
                [messageID]
            );
            return deleteMessage.rows[0];
        } catch (error) {
            throw error;
        }
    }
}

const messagesServcie = new MessagesService();

export default messagesServcie;