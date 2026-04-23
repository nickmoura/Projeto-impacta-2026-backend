import Patient from "../models/PatientModel.js";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import pool from "../config/db.js";


class PatientService {
    async createPatient(data) {
        const {nome, email, telefone, password, clinic_id} = data;

        if (!nome || !email || !telefone || !password || !clinic_id) {
            throw new Error("Todos os campos são obrigatórios");
        }

        let user;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            user = await User.createNewUser(
                nome,
                email,
                hashedPassword,
                "patient",
                clinic_id
            );

            const patient = await Patient.createPatient(
                nome,
                telefone,
                user.id,
            );

            return patient;

        } catch (error) {

            if (user) {
                await pool.query("DELETE FROM User WHERE id = ?", [user.id]);
            }
            
            if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
                const err = new Error("EMAIL_ALREADY_EXISTS");
                err.code = "EMAIL_ALREADY_EXISTS";
                throw err;
            }
                throw error;
        }
    }
}

export default new PatientService();