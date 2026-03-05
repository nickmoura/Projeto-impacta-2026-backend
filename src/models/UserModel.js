import pool from "../config/db.js";
import bcrypt from "bcrypt";


const User = {
    getAllUsers: async () => {
        const [rows] = await pool.query('SELECT * FROM User');
        return rows;
    },

    createNewUser: async (nome, cnpj, email, password) => {
        const query = `INSERT INTO User (nome, cnpj, email, password) values (?, ?, ?, ?)`;
        const [result] = await pool.query(query, [nome, cnpj, email, password]);

        return {
            id: result.insertId,
            nome,
            cnpj,
            email
        };
    },

    login: async (email, password) => {
        const [rows] = await pool.query("SELECT * FROM User WHERE email = ?", [email]);

        if (rows.length === 0) {
            throw new Error("Usuário nao encontrado");
        }

        const user = rows[0];

        const senhaValida = await bcrypt.compare(password, user.password);

        if (!senhaValida) {
            throw new Error("Senha inválida");
        }

        return user;
    }
};

export default User;