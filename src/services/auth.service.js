const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Função para registrar usuário
async function register(name, email, password) {
  // Verifica se já existe usuário
  const [existingUser] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (existingUser.length > 0) {
    throw new Error('Usuário já existe');
  }

  // Criptografar senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Inserir no banco
  await db.execute(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );

  return { message: 'Usuário registrado com sucesso' };
}

// Função de login
async function login(email, password) {
  const [users] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (users.length === 0) {
    throw new Error('Usuário não encontrado');
  }

  const user = users[0];

  // Comparar senha
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Senha inválida');
  }

  // Gerar token JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    message: 'Login realizado com sucesso',
    token
  };
}

module.exports = {
  register,
  login
};