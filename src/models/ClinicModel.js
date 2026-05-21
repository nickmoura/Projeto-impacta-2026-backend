import pool from '../config/db.js';

class ClinicModel {
  static async create({ nome, cnpj }) {
    const query = `
            INSERT INTO Clinic (nome, cnpj)
            VALUES (?, ?)
        `;

    const [result] = await pool.query(query, [nome, cnpj]);

    return result.insertId;
  }

  static async getAll() {
    const query = `SELECT id, nome, cnpj, FROM Clinic`;

    const [rows] = await pool.query(query);

    return rows;
  }

  static async getById(id) {
    const query = `SELECT id, nome, cnpj FROM Clinic WHERE id = ?`;

    const [rows] = await pool.query(query, [id]);

    return rows[0];
  }

  static async getByCNPJ(cnpj) {
    const query = `SELECT id, nome, cnpj FROM Clinic WHERE cnpj = ?`;

    const [rows] = await pool.query(query, [cnpj]);
    if (rows.length === 0) {
      throw new Error('Clínica não encontrada com cnpj fornecido');
    }

    return rows[0];
  }

  static async getDoctorsByClinicId(clinic_id) {
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
            WHERE d.clinic_id = ?
            `,
      [clinic_id],
    );
    return rows;
  }

  static async update(id, { nome, cnpj }) {
    const query = `
            UPDATE Clinic
            SET nome = ?, cnpj = ?
            WHERE id = ?
        `;

    await pool.query(query, [nome, cnpj, id]);
  }

  static async delete(id) {
    const query = `DELETE FROM Clinic WHERE id = ?`;

    await pool.query(query, [id]);
  }
}

export default ClinicModel;
