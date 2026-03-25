import express from 'express';
import  dashboradController  from '../controllers/dashboardController.js';
import  authMiddleware  from '../middleware/authMiddleware.js';
import appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, dashboradController);
router.post('/appointments', authMiddleware, appointmentController.createAppointment);
router.delete('/appointments/:appointment_id', authMiddleware, appointmentController.cancelAppointment);

export default router;
