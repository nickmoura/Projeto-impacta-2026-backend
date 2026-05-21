import bcrypt from 'bcrypt';
import Doctor from '../models/DoctorModel.js';
import Clinic from '../models/ClinicModel.js';
import User from '../models/UserModel.js';

class DoctorService {
  async createDoctor(data) {
    const { name, email, telefone, password, clinic_cnpj, specialty, crm } =
      data;

    if (
      !name ||
      !email ||
      !telefone ||
      !password ||
      !clinic_cnpj ||
      !specialty ||
      !crm
    ) {
      throw new Error('Todos os campos sao obrigatórios');
    }

    const clinic = await Clinic.getByCNPJ(clinic_cnpj);

    if (!clinic) {
      throw new Error('Clínica não encontrada');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;

    try {
      user = await User.createNewUser(
        name,
        email,
        hashedPassword,
        'DOCTOR',
        clinic.id,
      );

      const newDoctor = await Doctor.createDoctor(
        user.id,
        clinic.id,
        crm,
        specialty,
      );

      return await Doctor.getDoctorById(newDoctor.id);
    } catch (error) {
      if (user) {
        await User.deleteUserById(user.id);
      }

      if (error.code === 'ER_DUP_ENTRY') {
        const err = new Error('EMAIL_ALREADY_EXISTS');
        err.code = 'EMAIL_ALREADY_EXISTS';

        throw err;
      }

      throw error;
    }
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

    await Doctor.putDoctorById(doctor_id, {
      crm: data.crm,
      specialty: data.specialty,
    });

    const useData = {
      name: data.name,
      email: data.email,
    };

    if (data.password) {
      useData.password = await bcrypt.hash(data.password, 10);
    }

    await User.putUserById(doctorExists.user_id, useData);

    return await Doctor.getDoctorById(doctor_id);
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
