import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs';

dotenv.config();

const isProduction = process.env.DB_SSL_MODE === 'REQUIRED';

let sslOptions = false;
if (isProduction) {
    if (fs.existsSync('./etc/secrets/ca.pem')) {
        sslOptions = {
            ca: fs.readFileSync('./etc/secrets/ca.pem'),
            rejectUnauthorized: true
        };
    } else {
        console.warn('CA certificate file not found. SSL connection may fail.');
        sslOptions = { rejectUnauthorized: true };
    }
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: sslOptions,
    waitForConnections: true,
    connectionLimit: 10
});

export default pool;