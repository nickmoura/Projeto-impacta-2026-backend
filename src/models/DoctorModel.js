import pool from "../config/db.js";


const Doctor =  {

    createDoctor:  async (user_id, clinic_id, crm, specialty) => {
        const query = `INSERT INTO Doctor (user_id, clinic_id, crm, specialty) values (?, ?, ?, ?)`;
        const [result] = await pool.query(query, [
            user_id,
            clinic_id,
            crm,
            specialty
        ]);

        return {
            doctor_id: result.insertId,
            user_id,
            clinic_id,
            crm,
            specialty
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
        const { crm, specialty } = data;

        const query = `
            UPDATE Doctor 
            SET crm = ?, specialty = ? 
            WHERE id = ?
        `;

        const [result] = await pool.query(query, [
            crm, 
            specialty, 
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