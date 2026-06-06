import ClinicModel from '../models/ClinicModel.js';

class ClinicService {
  static async createClinic(data) {
    const clinicExists = await ClinicModel.getByCNPJ(data.cnpj);

    if (clinicExists) {
      throw new Error('Clínica já cadastrada');
    }

    const clinicId = await ClinicModel.create({
      nome: data.nome,
      cnpj: data.cnpj,
    });

    return clinicId;
  }

  static async getAllClinics() {
    return await ClinicModel.getAll();
  }

  static async getClinicById(id) {
    const clinic = await ClinicModel.getById(id);

    if (!clinic) {
      throw new Error('Clínica não encontrada');
    }

    return clinic;
  }

  static async getClinicIdByCNPJ(cnpj) {
    const clinic = await ClinicModel.getByCNPJ(cnpj);

    if (!clinic) {
      throw new Error('Clínica não encontrada');
    }

    return clinic.id;
  }

  static async getDoctorsByClinic(clinic_id) {
    return await ClinicModel.getDoctorsByClinicId(clinic_id);
  }

  static async updateClinic(id, data) {
    const clinic = await ClinicModel.getById(id);

    if (!clinic) {
      throw new Error('Clínica não encontrada');
    }

    await ClinicModel.update(id, data);
  }

  static async deleteClinic(id) {
    const clinic = await ClinicModel.getById(id);

    if (!clinic) {
      throw new Error('Clinica nao encontrada');
    }

    await ClinicModel.delete(id);
  }
}
export default ClinicService;
