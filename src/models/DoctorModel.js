import pool from "../config/db.js";


const Doctor = {

    createDoctor: async (user_id, clinic_id, crm, specialty, name, email, telefone) => {
        const query = `INSERT INTO Doctor
(user_id, clinic_id, crm, specialty, nome, email, telefone)
VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.query(query, [
            user_id,
            clinic_id,
            crm,
            specialty,
            name,
            email,
            telefone
        ]);

        return {
            doctor_id: result.insertId,
            user_id,
            clinic_id,
            crm,
            specialty,
            nome:name,
            email,
            telefone
        };
    },

    getDoctorByClinic: async (clinic_id) => {

        const [rows] = await pool.query(
            "SELECT * FROM Doctor WHERE clinic_id = ?",
            [clinic_id]
        );

        return rows;
    },

    getDoctorById: async (doctor_id) => {
        const [rows] = await pool.query(
            `SELECT
                d.id AS doctor_id,
                d.user_id,
                d.clinic_id,
                d.crm,
                d.specialty,
                u.nome,
                u.email
            FROM Doctor d
            JOIN User u ON d.user_id = u.id
            WHERE d.id = ?`,
            [doctor_id]
        );
        return rows.length ? rows[0] : null;
    },

    putDoctorById: async (doctor_id, data) => {
        const { crm, specialty, nome, email } = data;

        const query = `
            UPDATE Doctor 
            SET crm = ?, specialty = ?, nome = ?, email = ? 
            WHERE id = ?
        `;

        const [result] = await pool.query(query, [
            crm,
            specialty,
            nome,
            email,
            doctor_id
        ]);

        return result
    },

    deleteDoctorById: async (doctor_id) => {
        const query = `DELETE FROM Doctor WHERE id = ?`;
        await pool.query(query, [doctor_id]);
    }
};

export default Doctor;