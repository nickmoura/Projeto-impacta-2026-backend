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

    async PutPacientById(patient_id, data) {

        const {nome, email, telefone, password} = data;

        if (!patient_id || !nome || !email || !telefone || !password) {
            throw new Error("ID do paciente e dados são obrigatórios");
        }

        try {
            const patient =await Patient.putPatientbyId(patient_id, {
                nome,
                telefone
            });

            const [rows] =await pool.query(
                "SELECT user_id FROM Patient WHERE id = ?",
                [patient_id]
            );

            if (!rows.length) {
                throw new Error("Paciente não encontrado");
            }

            const user_id = rows[0].user_id;

            const hashedPassword = await bcrypt.hash(password, 10);

            await User.putPatientbyId(user_id, {
                nome,
                email,
                password: hashedPassword
            });

            return {message: "Paciente atualizado com sucesso"};
        } catch (error) {
            throw error;
        }
    }
}

export default new PatientService();