import Doctor from '../models/DoctorModel.js';
import Clinic from '../models/ClinicModel.js';
import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';


class DoctorService {
    async createDoctor(data) {
        const { doctor: name, email, telefone, password, cnpj,  specialty, crm } = data;

        if (!name || !email || !telefone || !password || !cnpj || !specialty || !crm) {
            throw new Error("Todos os campos sao obrigatórios");
        }

        let user;

        try {
            const clinic = await Clinic.getClinicByCNPJ(cnpj);

            if (!clinic) {
                throw new Error("Clínica não encontrada com o CNPJ fornecido");
            }
            
            const clinic_id = clinic.id;

            const hashedPassword = await bcrypt.hash(password, 10);

            user = await User.createNewUser(
                name,
                email,
                hashedPassword,
                "doctor",
                clinic_id
            );

            const newDoctor = await Doctor.createDoctor(
              user.id,
              clinic_id,
              crm,
              specialty
            );

            return newDoctor;

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

    async getDoctor_by_id(doctor_id) {
        const doctor = await Doctor.getDoctorById(doctor_id);

        if (!doctor) {
            throw new Error("Médico não encontrado");
        }

        return doctor;
    }

    async putDoctor_by_id(doctor_id, data) {
        const doctorExists = await Doctor.putDoctorById(doctor_id, data);

        if (!doctorExists) {
            throw new Error("Médico não encontrado");
        }

        await Doctor.putDoctorById(doctor_id, data);

        const updatedDoctor = await Doctor.getDoctorById(doctor_id);

        return updatedDoctor;
    }
}
export default new DoctorService();