import Doctor from '../models/DoctorModel.js';
import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';


class DoctorService {
    async createDoctor(data) {
        const { doctor, email, telefone, password, clinic_id,  specialty, crm } = data;

        if (!doctor || !email || !telefone || !password || !clinic_id || !specialty || !crm) {
            throw new Error("Todos os campos sao obrigatórios");
        }

        let user;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            user = await User.createNewUser(
                doctor,
                email,
                hashedPassword,
                "doctor",
                clinic_id
            );

            const doctor = await Doctor.createDoctor(
              user.id,
              clinic_id,
              crm,
              specialty
            );

            return doctor;

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
export default new DoctorService();