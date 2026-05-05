import express from 'express';
import { registro, login } from '../controllers/authController.js';
import clinicController from '../controllers/clinicController.js';


const router = express.Router();


router.post('/registro', registro);
router.post('/login', login);
router.get('/clinic', clinicController.getClinic);

export default router;