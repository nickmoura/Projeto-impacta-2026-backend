import ClinicService from '../services/clinicService.js';

class ClinicController {
  static async createClinic(req, res) {
    try {
      const { nome, cnpj, email, password } = req.body;

      if (!nome || !cnpj || !email || !password) {
        return res.status(400).json({
          error: 'Todos os campos são obrigatórios',
        });
      }

      const clinicId = await ClinicService.createClinic({
        nome,
        cnpj,
        email,
        password,
      });

      return res.status(201).json({
        message: 'Clínica criada com sucesso',
        clinicId,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  static async getAllClinics(req, res) {
    try {
      const clinic = await ClinicService.getAllClinics();

      return res.status(200).json(clinic);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  static async getClinicById(req, res) {
    try {
      const { id } = req.params;

      const clinic = await ClinicService.getClinicById(id);

      return res.status(200).json(clinic);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  static async getClinicIdByCNPJ(req, res) {
    try {
      const { cnpj } = req.params;

      if (!cnpj) {
        return res.status(400).json({
          error: 'CNPJ é onbrigatório',
        });
      }

      const clinicId = await ClinicService.getClinicIdByCNPJ(cnpj);

      return res.status(200).json({
        clinicId: clinicId,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  static async updateClinic(req, res) {
    try {
      const { id } = req.params;

      await ClinicService.updateClinic(id, req.body);

      return res.status(200).json({
        message: 'Clínica atualizada com sucesso',
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  static async deleteClinic(req, res) {
    try {
      const { id } = req.params;

      await ClinicService.deleteClinic(id);

      return res.status(200).json({
        message: 'Clínica removida com sucesso',
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

export default ClinicController;
