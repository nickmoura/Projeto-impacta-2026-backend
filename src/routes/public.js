//isso pode ser renomeado para dominio depois
//exemplo rota de usuarios logados userRouter
//rota de usuarios publicas como o login authRoutes
//nomes arbitrarios meninas podemos e provavelmente iremos mudar isso.

import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: "API funcionando corretamente" });
});

export default router;