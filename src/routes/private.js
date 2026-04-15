import express from 'express';

import dashboradController from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import appointmentController from '../controllers/appointmentController.js';
import patientController from '../controllers/patientController.js';

const router = express.Router();

// Dashboard
router.get('/dashboard', authMiddleware, dashboradController);

// Appointments
router.post('/appointments', authMiddleware, appointmentController.createAppointment);
router.get('/appointments', authMiddleware, appointmentController.getAppointments);
router.put('/appointments/:id', authMiddleware, appointmentController.updateAppointment);
router.delete('/appointments/:id', authMiddleware, appointmentController.cancelAppointment);

// Patients
router.post('/patients', authMiddleware, patientController.createPatient);

// 🔥 AQUI está sem autenticação (pra teste)
router.delete('/patients/:id', patientController.deletePatient);

export default router;