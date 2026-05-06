import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import Clinic from "../models/ClinicModel.js";

class AuthService {
  async register(nome, email, password, cnpj) {
    const [existingUser] = await db.execute(
      "SELECT * FROM User WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      throw new Error("Usuário já existe");
    }

    const clinic = await Clinic.getClinicByCNPJ(cnpj);

    if (!clinic) {
      throw new Error("Clínica não encontrada");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = "user";

    const [result] = await db.execute(
      `INSERT INTO User (nome, email, password, role, clinic_id)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, email, hashedPassword, role, clinic.id]
    );

    return {
      id: result.insertId,
      nome,
      email,
      role,
      clinic_id: clinic.id
    };
  }

  async login(email, password) {
    const [users] = await db.execute(
      "SELECT * FROM User WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      throw new Error("Usuário não encontrado");
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Senha inválida");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        clinic_id: user.clinic_id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        clinic_id: user.clinic_id,
        role: user.role
      }
    };
  }
}

export default new AuthService();