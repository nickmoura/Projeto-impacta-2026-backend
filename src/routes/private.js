import express from 'express';
import  dashboradController  from '../controllers/dashboardController.js';
import  authMiddleware  from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, dashboradController);

export default router;
