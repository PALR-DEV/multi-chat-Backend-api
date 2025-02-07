import { query } from "../config/postgres-config.js"

class ProfileImageService {
    async updateProfilePictureBinary(userId, imageBuffer) {
        try {
            // This will overwrite any existing profile picture in the same row
            const result = await query(
                'UPDATE Users SET profile_picture = $1::bytea WHERE id = $2 RETURNING *',
                [imageBuffer, userId]
            );
            
            if (!result.rows[0]) {
                throw new Error('User not found or update failed');
            }
            
            return result.rows[0];
        } catch (error) {
            throw new Error(`Failed to update profile picture: ${error.message}`);
        }
    }

    async getProfilePicture(userId) {
        const result = await query(
            'SELECT encode(profile_picture, \'base64\') as profile_picture FROM Users WHERE id = $1',
            [userId]
        );
        return result.rows[0]?.profile_picture;
    }

    async getOthersProfilePictures(userIds) {
        const result = await query(
            'SELECT id, encode(profile_picture, \'base64\') as profile_picture FROM Users WHERE id = ANY($1)',
            [userIds]
        );

        return result.rows;
    }
}

const profileImageService = new ProfileImageService();
export default profileImageService;