import pool from "../config/db.js";
import bcrypt from "bcrypt";


const User = {
    getAllUsers: async () => {
        const [rows] = await pool.query('SELECT * FROM User');
        return rows;
    },

    createNewUser: async (nome, email, password, role, clinic_id) => {
        const query = `INSERT INTO User (nome, email, password, role, clinic_id) values (?, ?, ?, ?, ?)`;
        const [result] = await pool.query(query, [
            nome, 
            email, 
            password, 
            role, 
            clinic_id
        ]);

        return {
            id: result.insertId,
            nome,
            email,
            role,
            clinic_id
        };
    },

    login: async (email, password) => {
        const [rows] = await pool.query("SELECT * FROM User WHERE email = ?", [email]);

        if (rows.length === 0) {
            throw new Error("Usuário não encontrado");
        }

        const user = rows[0];

        const senhaValida = await bcrypt.compare(password, user.password);

        if (!senhaValida) {
            throw new Error("Senha inválida");
        }

        return user;
    },

    getUserByEmail: async (email) => {
        const [rows] = await pool.query("SELECT * FROM User WHERE email = ?", [email]);

        return rows[0];
    },

    putUserById: async (user_id, data) => {

        const fields = [];
        const values = [];

        if (data.nome) {
            fields.push("nome = ?");
            values.push(data.nome);
        }

        if (data.email) {
            fields.push("email = ?");
            values.push(data.email);
        }

        if (data.password) {
            fields.push("password = ?");
            values.push(data.password);
        }

        values.push(user_id);

        const query = `
            UPDATE User
            SET ${fields.join(", ")}
            WHERE id = ?
        `;

        const [result] = await pool.query(query, values);

        return result;
    },

    deleteUserById: async (user_id) => {
        const [result] = await pool.query("DELETE FROM User WHERE id = ?", [user_id]);
        return result;
    }
};

export default User;