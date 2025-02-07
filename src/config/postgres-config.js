import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'senpai',
    host: process.env.POSTGRES_HOST || 'localhost', // Changed to container name
    database: process.env.POSTGRES_DB || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'senpai',
    port: process.env.POSTGRES_PORT || 5432,
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Successfully connected to PostgreSQL');
    release();
});

export const query = (text, params) => pool.query(text, params);
export default pool;