import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

dotenv.config();

const isProduction = process.env.DB_SSL_MODE === 'REQUIRED';

let sslOptions = false;

if (isProduction) {

    let caPath = '/etc/secrets/ca.pem';

    if (!fs.existsSync(caPath)) {
        caPath = path.resolve('etc/secrets/ca.pem');
    }

    if (fs.existsSync(caPath)) {
        sslOptions = {
            ca: fs.readFileSync(caPath),
            rejectUnauthorized: true
        };
    } else {
        console.warn('CA certificate not found. Using fallback SSL.');
        sslOptions = { rejectUnauthorized: false };
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