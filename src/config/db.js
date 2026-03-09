import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs';

dotenv.config();

const isProduction = process.env.DB_SSL_MODE === 'REQUIRED';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: isProduction ? { rejectUnauthorized: true } : false,
    waitForConnections: true,
    connectionLimit: 10,
    ssl: {
        ca: fs.readFileSync('./certs/ca.pem')
    }
});

export default pool;