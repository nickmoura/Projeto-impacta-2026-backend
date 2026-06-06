import pool from '../config/db.js';

const Patient = {
  createPatient: async (user_id, clinic_id) => {
    const query = `
            INSERT INTO Patient (user_id, clinic_id)
            VALUES (?, ?)
        `;

    const [result] = await pool.query(query, [user_id, clinic_id]);

    return {
      patient_id: result.insertId,
      user_id,
      clinic_id,
    };
  },

  getPatientsByClinic: async (clinic_id) => {
    const [rows] = await pool.query(
      `
            SELECT
                p.id AS patient_id,
                p.user_id,
                u.nome,
                u.email,
                u.telefone
            FROM Patient p
            INNER JOIN User u
                ON p.user_id = u.id
            WHERE p.clinic_id = ?
        `,
      [clinic_id],
    );

    return rows;
  },

  getPatientById: async (patient_id) => {
    const [rows] = await pool.query(
      `
            SELECT
                p.id AS patient_id,
                p.user_id,
                p.clinic_id,
                u.nome,
                u.email,
                u.telefone
            FROM Patient p
            INNER JOIN User u
                ON p.user_id = u.id
            WHERE p.id = ?
        `,
      [patient_id],
    );

    return rows[0];
  },

  getPatientUserId: async (patient_id) => {
    const [rows] = await pool.query(
      'SELECT user_id FROM Patient WHERE id = ?',
      [patient_id],
    );

    return rows[0];
  },

  deletePatientById: async (patient_id) => {
    const [result] = await pool.query('DELETE FROM Patient WHERE id = ?', [
      patient_id,
    ]);

    return result;
  },
};

export default Patient;
