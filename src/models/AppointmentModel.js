import pooll from "../config/database.js";

const Appointment = {

    createAppointement: async (
        clinic_id,
        doctor_id,
        patient_id,
        created_by,
        appointment_date,
        status
    ) => {

        const query = `INSERT INTO Appointment 
        (clinic_id, doctor_id, patient_id, created_by, appointment_date, status) 
        values (?, ?, ?, ?, ?, ?)`;

        const [result] = await pool.query(query, [
            clinic_id,
            doctor_id,
            patient_id,
            created_by,
            appointment_date,
            status
        ]);

        return {
            appointment_id: result.insertId,
            clinic_id,
            doctor_id,
            appointment_date,
            status
        };
    },

    getAppointmentsByClinic: async (clinic_id) => {
        const query = `
            SELECT  
            a.appointment_id,
            a.date,
            a.status,
            p.nome AS patient_name,
            u.nome AS doctor_name
        FROM Appointment a
        JOIN Patient p ON a.patient_id = p.patient_id
        JOIN Doctor d ON a.doctor_id = d.doctor_id
        JOIN User u ON d.user_id = u.user_id
        WHERE a.clinic_id = ? 
        `;

        const [rows] = await pool.query(query, [clinic_id]);

        return rows;
    }

};

export default Appointment;

// seguinte para nao da merda o endpoint precisa fazer um filtro por data ou medico, se nao e possivel que ele puche tudo que tem no banco de dados.