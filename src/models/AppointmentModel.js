import pool from "../config/db.js";


const Appointment = {

    createAppointment: async (
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
            a.id,
            a.appointment_date,
            a.status,
            p.nome AS patient_name,
            u.nome AS doctor_name
        FROM Appointment a
        JOIN Patient p ON a.patient_id = p.id
        JOIN Doctor d ON a.doctor_id = d.id
        JOIN User u ON d.user_id = u.id
        WHERE a.clinic_id = ? 
        `;

        const [rows] = await pool.query(query, [clinic_id]);

        return rows;
    },

   getAppointmentByUser: async (user_id) => {
    const query = `
       SELECT  
        a.id,
        a.appointment_date,
        a.status,
        p.nome AS patient_name,
        u.nome AS doctor_name
    FROM Appointment a
    LEFT JOIN Patient p ON a.patient_id = p.id
    LEFT JOIN Doctor d ON a.doctor_id = d.id
    LEFT JOIN User u ON d.user_id = u.id
    WHERE 
        a.created_by = ?
        OR d.user_id = ?
    `;

    const [rows] = await pool.query(query, [user_id, user_id]);

    if (rows.length === 0) return null;

    return rows;

   },
    

    updateAppointmentById: async (appointment_id, data) => {
    
        const [rows] = await pool.query(
            `SELECT * FROM Appointment WHERE id = ?`,
            [appointment_id]
        );

        if (rows.length === 0) return null;

        const fields = [];
        const values = [];

        if (data.clinic_id !== undefined) {
            fields.push("clinic_id = ?");
            values.push(data.clinic_id);
        }
        if (data.doctor_id !== undefined) {
            fields.push("doctor_id = ?");
            values.push(data.doctor_id);
        }
        if (data.patient_id !== undefined) {
            fields.push("patient_id = ?");
            values.push(data.patient_id);
        }
        if (data.appointment_date !== undefined) {
            fields.push("appointment_date = ?");
            values.push(data.appointment_date);
        }
        if (data.status !== undefined) {
            fields.push("status = ?");
            values.push(data.status);
        }

        if (fields.length === 0) return rows[0];

        values.push(appointment_id);

        const query = `UPDATE Appointment SET ${fields.join(", ")} WHERE id = ?`;

        await pool.query(query, values);

        
        const [updatedRows] = await pool.query(
            `SELECT * FROM Appointment WHERE id = ?`,
            [appointment_id]
        );

        return updatedRows[0];
    },

    cancelAppointmentById: async (appointment_id) => {
        const [rows] = await pool.query(
            `SELECT * FROM Appointment WHERE id = ?`,
            [appointment_id]
        );

        if (rows.length === 0) return null;

        const appointment = rows[0];

        if (appointment.status === "cancelled") {
            return { alreadyCancelled: true };
        }

        await pool.query(
            `UPDATE Appointment SET status = 'cancelled' WHERE id = ?`,
            [appointment_id]
        );

        return { alreadyCancelled: false };
    }
};

export default Appointment;

// seguinte para nao da merda o endpoint precisa fazer um filtro por data ou medico, se nao e possivel que ele puche tudo que tem no banco de dados.