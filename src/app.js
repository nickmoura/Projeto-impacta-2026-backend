import express from 'express';
import dotenv from 'dotenv';

import publicRoutes from './routes/public.js';
import privateRoutes from './routes/private.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(publicRoutes);
app.use(privateRoutes);

export default app;