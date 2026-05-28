import pool from '../config/db.js';

class DoctorModel {
  async createDoctor(user_id, clinic_id, crm, specialty) {
    const query = `
            INSERT INTO Doctor 
            (user_id, clinic_id, crm, specialty)
            VALUES (?, ?, ?, ?)
        `;

    const [result] = await pool.query(query, [
      user_id,
      clinic_id,
      crm,
      specialty,
    ]);

    return {
      id: result.insertId,
      user_id,
      clinic_id,
      crm,
      specialty,
    };
  }

  async getDoctorById(doctor_id) {
    const [rows] = await pool.query(
      `
            SELECT
                d.id AS doctor_id,
                d.crm,
                d.specialty,
                d.clinic_id,
                u.id AS user_id,
                u.nome,
                u.email,
                u.telefone
            FROM Doctor d
            JOIN User u ON d.user_id = u.id
            WHERE d.id = ?
            `,
      [doctor_id],
    );
    return rows.length ? rows[0] : null;
  }

  async putDoctorById(doctor_id, data) {
    const { crm, specialty } = data;

    const query = `
            UPDATE Doctor
            SET crm = ?, specialty = ?
            WHERE id = ?
        `;

    const [result] = await pool.query(query, [crm, specialty, doctor_id]);

    return result;
  }

  async deleteDoctorById(doctor_id) {
    const query = `DELETE FROM Doctor WHERE id = ?`;

    await pool.query(query, [doctor_id]);
  }
}
export default new DoctorModel();
