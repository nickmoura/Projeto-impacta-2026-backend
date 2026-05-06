import Patient from "../models/PatientModel.js";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import pool from "../config/db.js";

class PatientService {

    async createPatient(data) {
        const { nome, email, telefone, password, clinic_id } = data;

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
                email,
                telefone,
                user.id,
            );

            return patient;

        } catch (error) {

            // rollback se der erro
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

    async getPatientsByClinicId(clinic_id) {
        const rows = await Patient.getPatientsByClinic(clinic_id); // ← usa o model que já existe
        return rows;
    }

    async PutPacientById(patient_id, data) {

        const { nome, email, telefone, password } = data;

        if (!patient_id || !nome || !email || !telefone || !password) {
            throw new Error("ID do paciente e dados são obrigatórios");
        }

        try {
            const patient = await Patient.putPatientbyId(patient_id, {
                nome,
                telefone
            });

            const [rows] = await pool.query(
                "SELECT user_id FROM Patient WHERE id = ?",
                [patient_id]
            );

            if (!rows.length) {
                throw new Error("Paciente não encontrado");
            }

            const user_id = rows[0].user_id;

            const hashedPassword = await bcrypt.hash(password, 10);

            await User.putUserById(user_id, {
                nome,
                email,
                password: hashedPassword
            });

            return { message: "Paciente atualizado com sucesso" };
        } catch (error) {
            throw error;
        }
    }

    async patchPatientById(patient_id, data) {
        const { nome, email, telefone, password } = data;

        if (!patient_id) {
            throw new Error("ID do paciente é obrigatório");
        }

        const [rows] = await pool.query(
            "SELECT * FROM Patient WHERE id = ?",
            [patient_id]
        );

        if (!rows.length) {
            throw new Error("Paciente não encontrado");
        }

        const patientAtual = rows[0];

        const novoNome = nome ?? patientAtual.nome;
        const novoTelefone = telefone ?? patientAtual.telefone;

        await Patient.putPatientbyId(patient_id, {
            nome: novoNome,
            telefone: novoTelefone
        });

        const [userRows] = await pool.query(
            "SELECT * FROM User WHERE id = ?",
            [patientAtual.user_id]
        );

        const userAtual = userRows[0];

        const novoEmail = email ?? userAtual.email;

        if (email) {
            const existingUser = await User.getUserByEmail(email);

            if (existingUser && existingUser.id !== userAtual.id) {
                const err = new Error("EMAIL_ALREADY_EXISTS");
                err.code = "EMAIL_ALREADY_EXISTS";
                throw err;
            }
        }

        let novaSenha = userAtual.password;

        if (password) {
            novaSenha = await bcrypt.hash(password, 10);
        }

        await User.putUserById(userAtual.id, {
            nome: novoNome,
            email: novoEmail,
            password: novaSenha
        });

        return { message: "Paciente atualizado parcialmente com sucesso" };
    }

    async deletePatient(id) {
        if (!id) {
            throw new Error("ID do paciente é obrigatório");
        }

        const patient = await Patient.getPatientById(id);

        if (!patient) {
            return false;
        }

        await User.deleteUserById(patient.user_id);

        return true;
    }

}

export default new PatientService();