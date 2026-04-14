import express from 'express';

import dashboradController  from '../controllers/dashboardController.js';
import authMiddleware  from '../middleware/authMiddleware.js';
import appointmentController from '../controllers/appointmentController.js';
import patientController from '../controllers/patientController.js';


const router = express.Router();

router.get('/dashboard', authMiddleware, dashboradController);

router.post('/appointments', authMiddleware, appointmentController.createAppointment);
router.get('/appointments', authMiddleware, appointmentController.getAppointments);
router.put('/appointments/:id', authMiddleware, appointmentController.updateAppointment);
router.delete('/appointments/:id', authMiddleware, appointmentController.cancelAppointment);

router.post('/patients', authMiddleware, patientController.createPatient);

export default router;
