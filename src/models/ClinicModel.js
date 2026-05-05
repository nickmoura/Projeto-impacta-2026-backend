import pool from "../config/db.js";

const Clinic = {
    getClinicByCNPJ: async (cnpj) => {
        const query = `SELECT id, nome FROM Clinic WHERE cnpj = ?`;
        const [rows] = await pool.query(query, [cnpj]);
        if (rows.length === 0) {
            throw new Error("Clínica não encontrada com o CNPJ fornecido");
        }
        return rows[0];
    }
};

export default Clinic;