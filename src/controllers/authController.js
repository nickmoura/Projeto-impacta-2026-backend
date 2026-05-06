import authService from "../services/AuthService.js";

const registro = async (req, res) => {
  try {
    const { nome, email, password, cnpj } = req.body;

    if (!nome || !email || !password || !cnpj) {
      return res.status(400).json({
        error: "nome, e-mail, senha e cnpj são obrigatórios"
      });
    }

    const user = await authService.register(nome, email, password, cnpj);

    return res.status(201).json({
      message: "Usuário registrado com sucesso!",
      user
    });

  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return res.status(200).json({
      message: "Login realizado com sucesso",
      token: result.token,
      user: result.user
    });

  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
};

export { registro, login };