import Doctor from '../models/DoctorModel.js';
import Clinic from '../models/ClinicModel.js';
import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';

class DoctorService {
  async createDoctor(data) {
    //remover essa duplicacao de codigo e redundancia
    const {
      doctor: name,
      email,
      telefone,
      password,
      clinic_cnpj,
      clinic_id: providedClinicId,
      specialty,
      crm,
    } = data;

    if (!name || !email || !telefone || !password || !specialty || !crm) {
      throw new Error('Todos os campos sao obrigatórios');
    }

    if (!clinic_cnpj && !providedClinicId) {
      throw new Error('clinic_cnpj ou clinic_id é obrigatório');
    }

    let user;

    try {
      let clinic_id;

      if (providedClinicId) {
        clinic_id = providedClinicId;
      } else {
        const clinic = await Clinic.getClinicByCNPJ(clinic_cnpj);

        if (!clinic) {
          throw new Error('Clínica não encontrada com o CNPJ fornecido');
        }

        clinic_id = clinic.id;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = await User.createNewUser(
        name,
        email,
        hashedPassword,
        'doctor',
        clinic_id,
      );

      const newDoctor = await Doctor.createDoctor(
        user.id,
        clinic_id,
        crm,
        specialty,
        name,
        email,
        telefone,
      );

      return newDoctor;
    } catch (error) {
      if (user) {
        await pool.query('DELETE FROM User WHERE id = ?', [user.id]);
      }

      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        if (error.message && error.message.includes('email')) {
          const err = new Error('EMAIL_ALREADY_EXISTS');
          err.code = 'EMAIL_ALREADY_EXISTS';
          throw err;
        }
      }

      throw error;
    }
  }

  async getDoctorsByClinic(clinic_id) {
    // mover isso para api de clinica
    // Reutiliza o método getDoctorByClinic que já existe no DoctorModel
    const doctors = await Doctor.getDoctorByClinic(clinic_id);
    return doctors;
  }

  async getDoctor_by_id(doctor_id) {
    const doctor = await Doctor.getDoctorById(doctor_id);

    if (!doctor) {
      throw new Error('Médico não encontrado');
    }

    return doctor;
  }

  async putDoctor_by_id(doctor_id, data) {
    const doctorExists = await Doctor.getDoctorById(doctor_id);

    if (!doctorExists) {
      throw new Error('Médico não encontrado');
    }

    const doctorData = {
      crm: data.crm,
      specialty: data.specialty,
      nome: data.doctor,
      email: data.email,
    };

    await Doctor.putDoctorById(doctor_id, doctorData);

    const userData = {
      nome: data.doctor,
      email: data.email,
    };

    if (data.password) {
      userData.password = await bcrypt.hash(data.password, 10);
    }

    await User.putUserById(doctorExists.user_id, userData);

    const updatedDoctor = await Doctor.getDoctorById(doctor_id);

    return updatedDoctor;
  }

  async deleteDoctor_by_id(doctor_id) {
    const doctorExists = await Doctor.getDoctorById(doctor_id);

    if (!doctorExists) {
      throw new Error('Médico não encontrado');
    }

    await Doctor.deleteDoctorById(doctor_id);

    await User.deleteUserById(doctorExists.user_id);
  }
}
export default new DoctorService();
