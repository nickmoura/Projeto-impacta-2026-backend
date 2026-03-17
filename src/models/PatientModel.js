import pool from "../config/db.js";

const Patient = {

    createPatient: async (nome, email, telefone, endereco, clinic_id) => {
        const query = `INSERT INTO Patient (nome, email, telefone, endereco, clinic_id) values (?, ?, ?, ?, ?)`;
        const [result] = await pool.query(query, [
            nome,
            email,
            telefone,
            endereco,
            clinic_id
        ]);

        return {
            patient_id: result.insertId,
            nome,
            email,
            telefone,
            endereco,
            clinic_id
        };
    },

    getPatientsByClinic: async (clinic_id) => {
        const [rows] = await pool.query(
            "SELECT * FROM Patient WHERE clinic_id = ?",
            [clinic_id]
        );

        return rows;

    }
};

export default Patient;