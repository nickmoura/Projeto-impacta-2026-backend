import pool from "../config/db.js";

const Patient = {

    createPatient: async (nome, telefone, user_id) => {
        const query = `INSERT INTO Patient (nome, telefone, user_id) values (?, ?, ?)`;
        const [result] = await pool.query(query, [
            nome,
            telefone,
            user_id,
        ]);

        return {
            patient_id: result.insertId,
            nome,
            telefone,
            user_id
        };
    },

    getPatientsByClinic: async (clinic_id) => {
        const [rows] = await pool.query(`
            SELECT p.*,
            FROM Patient p
            JOIN User u ON p.user_id = u.id
            WHERE u.clinic_id = ?
        `, [clinic_id]);

        return rows;
    }
};

export default Patient;