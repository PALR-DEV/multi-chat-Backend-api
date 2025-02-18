import { query } from '../config/postgres-config.js';
import { generateToken, verifyToken } from '../config/jwtUtils.js';
import bcrypt from 'bcrypt';

class AuthService {

    async addUser(payload) {
        const {username, firstname, lastname, email, passwordhash, userlanguage} = payload;
        const hash = await bcrypt.hash(passwordhash, 10);
        const result = await query(
            'INSERT INTO Users (username, firstname, lastname, email, passwordhash, userlanguage) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [username, firstname, lastname, email, hash, userlanguage]
        );
        return result.rows[0];
    }

    async login(email, password) {
        try {
            const result = await query('SELECT * FROM Users WHERE email = $1 ', [email]);
            if (!result.rows || result.rows.length === 0) {
                return null;
            }
            const user = result.rows[0];
            try {
                const isValid = await bcrypt.compare(password, user.passwordhash);
                if (!isValid) {
                    return null;
                }
                
                const token = generateToken(user);
                return {token , user };
            } catch (error) {
                console.error('Error during password comparison:', error);
                return null;
            }
            
        } catch (error) {
            throw error;
            
        }
    }

    async getUser(userId) {
        const result = await query('SELECT * FROM Users WHERE id = $1', [userId]);
        return result.rows[0];
    }

    async checkEmail(email) {
        const result = await query('SELECT * FROM Users WHERE email = $1', [email]);
        if(result.rows.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    //FIXME: this is for dev 
    async getAllUsers() {
        const result = await query('SELECT * FROM Users');
        return result.rows;
    }

    async getUserInfo(token) {
        try {
            const decoded = verifyToken(token);
            if (!decoded) {
                return null;
            }
            
            const result = await query('SELECT * FROM Users WHERE id = $1', [decoded.id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;