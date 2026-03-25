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
    }
};

export default Doctor;