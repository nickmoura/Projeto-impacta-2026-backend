const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Simulação de banco de dados (depois podemos trocar por banco real)
const users = [];

// Criar usuário
async function createUser(name, email, password) {
  const userExists = users.find(user => user.email === email);

  if (userExists) {
    throw new Error('Usuário já existe');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword
  };

  users.push(newUser);

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email
  };
}

// Login
async function login(email, password) {
  const user = users.find(user => user.email === email);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error('Senha inválida');
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "segredo_super_secreto",
    { expiresIn: "1h" }
  );

  return {
    message: "Login realizado com sucesso",
    token
  };
}

module.exports = {
  createUser,
  login
};