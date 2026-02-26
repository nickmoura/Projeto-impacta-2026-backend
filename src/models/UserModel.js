import pool from "../config/db.js";


const User = {
    getAllUsers: async () => {
        try {
            const [rows] = await pool.query('SELECT * FROM users');
            return rows;
        } catch (error) {
            throw error;
        }
    },

    createNewUser: async (nome, cpf, email, password) => {
        try {
            const query = `INSERT INTO users (nome, cpf, email, password) VALUES (?, ?, ?, ?)`;
            const [result] = await pool.query(query, [nome, cpf, email, password]);

            return {
                id: result.insertId,
                nome,
                cpf,
                email
            };
            
        } catch (error) {
            throw error;
        }
    }
};

export default User;