//isso pode ser renomeado para dominio depois
//exemplo rota de usuarios logados userRouter
//rota de usuarios publicas como o login authRoutes
//nomes arbitrarios meninas podemos e provavelmente iremos mudar isso.

import express from 'express';
import { login } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: "API funcionando corretamente" });
});

// 🔐 Rota de login
router.post('/login', login);

export default router;