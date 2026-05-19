import pool from '../config/db.js';

class ClinicModel {
  static async create({ nome, cnpj, email, password }) {
    const query = `
            INSERT INTO Clinic (nome, cnpj, email, password)
            VALUES (?, ?, ?, ?)
        `;

    const [result] = await pool.query(query, [nome, cnpj, email, password]);

    return result.insertId;
  }

  static async getAll() {
    const query = `SELECT id, nome, cnpj, email FROM Clinic`;

    const [rows] = await pool.query(query);

    return rows;
  }

  static async getById(id) {
    const query = `SELECT id, nome, cnpj, email FROM Clinic WHERE id = ?`;

    const [rows] = await pool.query(query, [id]);

    return rows[0];
  }

  static async getByCNPJ(cnpj) {
    const query = `SELECT id, nome, cnpj, email FROM Clinic WHERE cnpj = ?`;

    const [rows] = await pool.query(query, [cnpj]);

    return rows[0];
  }

  static async update(id, { nome, cnpj, email, password }) {
    const query = `
            UPDATE Clinic
            SET nome = ?, cnpj = ?, email = ?, password = ?
            WHERE id = ?
        `;

    await pool.query(query, [nome, cnpj, email, password, id]);
  }

  static async delete(id) {
    const query = `DELETE FROM Clinic WHERE id = ?`;

    await pool.query(query, [id]);
  }
}

export default ClinicModel;
