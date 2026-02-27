const authService = require('../services/auth.service');

// Registro
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const result = await authService.register(name, email, password);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  register,
  login
};