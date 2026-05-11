import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import AuthService from "../src/services/authService.js";
import db from "../src/config/db.js";
import Clinic from "../src/models/ClinicModel.js";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

jest.mock("../src/config/db.js", () => ({
  __esModule: true,
  default: {
    execute: jest.fn(),
  },
}));

jest.mock("../src/models/ClinicModel.js", () => ({
  __esModule: true,
  default: {
    getClinicByCNPJ: jest.fn(),
  },
}));

describe("AuthService", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "secret_test";
  });

  describe("register", () => {

    it("deve registrar um usuário com sucesso", async () => {

      db.execute
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{ insertId: 1 }]);

      Clinic.getClinicByCNPJ.mockResolvedValue({
        id: 10,
      });

      bcrypt.hash.mockResolvedValue("hashed_password");

      const result = await AuthService.register(
        "Lucas",
        "lucas@test.com",
        "123456",
        "12345678000199"
      );

      expect(db.execute).toHaveBeenCalledTimes(2);

      expect(bcrypt.hash).toHaveBeenCalledWith(
        "123456",
        10
      );

      expect(result).toEqual({
        id: 1,
        nome: "Lucas",
        email: "lucas@test.com",
        role: "user",
        clinic_id: 10,
      });
    });

    it("deve lançar erro se usuário já existir", async () => {

      db.execute.mockResolvedValueOnce([
        [{ id: 1 }]
      ]);

      await expect(
        AuthService.register(
          "Lucas",
          "lucas@test.com",
          "123456",
          "123"
        )
      ).rejects.toThrow("Usuário já existe");

      expect(Clinic.getClinicByCNPJ).not.toHaveBeenCalled();
    });

    it("deve lançar erro se clínica não existir", async () => {

      db.execute.mockResolvedValueOnce([[]]);

      Clinic.getClinicByCNPJ.mockResolvedValue(null);

      await expect(
        AuthService.register(
          "Lucas",
          "lucas@test.com",
          "123456",
          "123"
        )
      ).rejects.toThrow("Clínica não encontrada");

      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

  });

  describe("login", () => {

    it("deve fazer login com sucesso", async () => {

      const fakeUser = {
        id: 1,
        email: "lucas@test.com",
        password: "hashed_password",
        clinic_id: 10,
        role: "user",
      };

      db.execute.mockResolvedValueOnce([
        [fakeUser]
      ]);

      bcrypt.compare.mockResolvedValue(true);

      jwt.sign.mockReturnValue("fake_token");

      const result = await AuthService.login(
        "lucas@test.com",
        "123456"
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "123456",
        "hashed_password"
      );

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: 1,
          email: "lucas@test.com",
          clinic_id: 10,
          role: "user",
        },
        "secret_test",
        { expiresIn: "1h" }
      );

      expect(result).toEqual({
        token: "fake_token",
        user: {
          id: 1,
          email: "lucas@test.com",
          clinic_id: 10,
          role: "user",
        },
      });
    });

    it("deve lançar erro se usuário não existir", async () => {

      db.execute.mockResolvedValueOnce([
        []
      ]);

      await expect(
        AuthService.login(
          "naoexiste@test.com",
          "123456"
        )
      ).rejects.toThrow("Usuário não encontrado");

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("deve lançar erro se senha for inválida", async () => {

      const fakeUser = {
        id: 1,
        email: "lucas@test.com",
        password: "hashed_password",
        clinic_id: 10,
        role: "user",
      };

      db.execute.mockResolvedValueOnce([
        [fakeUser]
      ]);

      bcrypt.compare.mockResolvedValue(false);

      await expect(
        AuthService.login(
          "lucas@test.com",
          "senha_errada"
        )
      ).rejects.toThrow("Senha inválida");

      expect(jwt.sign).not.toHaveBeenCalled();
    });

  });

});