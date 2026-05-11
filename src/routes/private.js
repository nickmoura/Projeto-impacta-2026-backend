import express from 'express';

import dashboradController from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import appointmentController from '../controllers/appointmentController.js';
import patientController from '../controllers/patientController.js';
import doctorController from '../controllers/doctorController.js';

const router = express.Router();


router.get('/dashboard', authMiddleware, dashboradController);


router.post('/appointments', authMiddleware, appointmentController.createAppointment);
router.get('/appointments', authMiddleware, appointmentController.getAppointments);
router.put('/appointments/:id', authMiddleware, appointmentController.updateAppointment);
router.delete('/appointments/:id', authMiddleware, appointmentController.cancelAppointment);


router.post('/patients', authMiddleware, patientController.createPatient);
router.get('/patients', authMiddleware, patientController.getPatients);
router.put('/patients/:patient_id', authMiddleware, patientController.PutPacientById);
router.patch('/patients/:patient_id', authMiddleware, patientController.patchPatient);
router.get('/patients/clinic/:clinic_id', authMiddleware, patientController.getPatientsByClinic);

router.delete('/patients/:id', authMiddleware, patientController.deletePatient);

router.post('/doctors', authMiddleware, doctorController.createDoctor);
router.get('/doctors/:doctor_id', authMiddleware, doctorController.getDoctor);

export default router;