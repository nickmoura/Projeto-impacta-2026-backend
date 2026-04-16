import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";

import publicRoutes from './routes/public.js';
import privateRoutes from './routes/private.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: [`http://localhost:5173`,`http://localhost:5174`, `https://cliniflow-dev.vercel.app`, `https://cliniflow-tcc.vercel.app`, `https://www.cliniflow.cloud`, `https://cliniflow.cloud`, `https://dev.cliniflow.cloud`],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api', publicRoutes);
app.use('/api', privateRoutes);

export default app;