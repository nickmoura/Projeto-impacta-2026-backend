import express from 'express';
import { registro, login } from '../controllers/authController.js';


const router = express.Router();


router.post('/registro', registro);
router.post('/login', login);
router.get('/clinic', clinicController.getClinic);

export default router;