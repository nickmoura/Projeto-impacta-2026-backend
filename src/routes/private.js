import express from 'express';
<<<<<<< HEAD
import  dashboradController  from '../controllers/dashboardController.js';
import  authMiddleware  from '../middleware/authMiddleware.js';
import appointmentController from '../controllers/appointmentController.js';
=======
import dashboradController from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import editarConsulta from '../controllers/consultaController.js';
>>>>>>> af41138 (feat: endpoint editar consulta)

const router = express.Router();

router.get('/dashboard', authMiddleware, dashboradController);
<<<<<<< HEAD
router.post('/appointments', authMiddleware, appointmentController.createAppointment);
=======
router.put('/consultas/:id', editarConsulta);
>>>>>>> af41138 (feat: endpoint editar consulta)

export default router;
