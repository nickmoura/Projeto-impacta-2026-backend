import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { registro, login} from "../src/controllers/authController.js";
import User from "../src/models/UserModel.js";


jest.mock("../src/models/UserModel.js", () => ({
  __esModule: true,
  default: {
    createNewUser: jest.fn(),
    login: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
  },
}));

jest.mock("jsonwebtoken", () => ({
  __esModule: true,
  default: {
    sign: jest.fn(),
  },
}));

describe("AuthController - registro", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        nome: "Lucas",
        cpf: "12345678900",
        email: "lucas@email.com",
        password: "123456",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("deve retornar 400 se faltar campos obrigatórios", async () => {
    req.body = {};

    await registro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "nome, cpf, e-mail e senha são obrigatórios",
    });
  });

  it("deve registrar usuário com sucesso", async () => {
    bcrypt.hash.mockResolvedValue("hashFake");

    User.createNewUser.mockResolvedValue({
      id: 1,
      nome: "Lucas",
      email: "lucas@email.com",
    });

    await registro(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);

    expect(User.createNewUser).toHaveBeenCalledWith(
      "Lucas",
      "12345678900",
      "lucas@email.com",
      "hashFake"
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuário registrado com sucesso!",
      user: expect.any(Object),
    });
  });

  it("deve retornar 500 se ocorrer erro", async () => {
    bcrypt.hash.mockRejectedValue(new Error("Erro interno"));

    await registro(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro ao registrar o usuário",
    });
  });
});

describe("AuthController - login", () => {
  let req;
  let res;

  beforeEach(() => {
    process.env.JWT_SECRET = "segredo";

    req = {
      body: {
        email: "lucas@email.com",
        password: "123456",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("deve fazer login com sucesso", async () => {
    User.login.mockResolvedValue({
      id: 1,
      email: "lucas@email.com",
    });

    jwt.sign.mockReturnValue("tokenFake");

    await login(req, res);

    expect(User.login).toHaveBeenCalledWith(
      "lucas@email.com",
      "123456"
    );

    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 1, email: "lucas@email.com" },
      "segredo",
      { expiresIn: "1h" }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login realizado com sucesso",
      token: "tokenFake",
    });
  });

  it("deve retornar 400 se login falhar", async () => {
    User.login.mockRejectedValue(
      new Error("Credenciais inválidas")
    );

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Credenciais inválidas",
    });
  });
});