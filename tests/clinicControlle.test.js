import ClinicController from '../src/controllers/clinicController.js';
import ClinicService from '../src/services/clinicService.js';

jest.mock('../src/services/clinicService.js');

describe('ClinicController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('createClinic', () => {
    it('deve criar clínica com sucesso', async () => {
      ClinicService.createClinic.mockResolvedValue(1);

      req.body = {
        nome: 'Clinic Test',
        cnpj: '123456789',
        email: 'clinic@test.com',
        password: '123456',
      };

      await ClinicController.createClinic(req, res);

      expect(ClinicService.createClinic).toHaveBeenCalledWith({
        nome: 'Clinic Test',
        cnpj: '123456789',
        email: 'clinic@test.com',
        password: '123456',
      });

      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Clínica criada com sucesso',
        clinicId: 1,
      });
    });

    it('deve retornar 400 quando faltar campos obrigatórios', async () => {
      req.body = {
        nome: 'Clinic Test',
      };

      await ClinicController.createClinic(req, res);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith({
        error: 'Todos os campos são obrigatórios',
      });
    });

    it('deve retornar 500 em caso de erro', async () => {
      ClinicService.createClinic.mockRejectedValue(new Error('Erro interno'));

      req.body = {
        nome: 'Clinic Test',
        cnpj: '123456789',
        email: 'clinic@test.com',
        password: '123456',
      };

      await ClinicController.createClinic(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno',
      });
    });
  });

  describe('getAllClinics', () => {
    it('deve retornar todas as clínicas', async () => {
      const clinics = [{ id: 1 }];

      ClinicService.getAllClinics.mockResolvedValue(clinics);

      await ClinicController.getAllClinics(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(clinics);
    });

    it('deve retornar 500 em caso de erro', async () => {
      ClinicService.getAllClinics.mockRejectedValue(new Error('Erro interno'));

      await ClinicController.getAllClinics(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno',
      });
    });
  });

  describe('getClinicById', () => {
    it('deve retornar clínica por id', async () => {
      req.params = { id: '1' };

      const clinic = { id: 1 };

      ClinicService.getClinicById.mockResolvedValue(clinic);

      await ClinicController.getClinicById(req, res);

      expect(ClinicService.getClinicById).toHaveBeenCalledWith('1');

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(clinic);
    });

    it('deve retornar 404 em caso de erro', async () => {
      req.params = { id: '1' };

      ClinicService.getClinicById.mockRejectedValue(
        new Error('Clínica não encontrada'),
      );

      await ClinicController.getClinicById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        error: 'Clínica não encontrada',
      });
    });
  });

  describe('getClinicIdByCNPJ', () => {
    it('deve retornar clinicId', async () => {
      req.params = { cnpj: '123456789' };

      ClinicService.getClinicIdByCNPJ.mockResolvedValue(10);

      await ClinicController.getClinicIdByCNPJ(req, res);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        clinicId: 10,
      });
    });

    it('deve retornar 400 quando não enviar cnpj', async () => {
      req.params = {};

      await ClinicController.getClinicIdByCNPJ(req, res);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith({
        error: 'CNPJ é obrigatório',
      });
    });

    it('deve retornar 404 em caso de erro', async () => {
      req.params = { cnpj: '123456789' };

      ClinicService.getClinicIdByCNPJ.mockRejectedValue(
        new Error('Clínica não encontrada'),
      );

      await ClinicController.getClinicIdByCNPJ(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        error: 'Clínica não encontrada',
      });
    });
  });

  describe('getDoctorsByClinic', () => {
    it('deve retornar médicos da clínica', async () => {
      req.params = { clinic_id: '1' };

      const doctors = [{ id: 1, nome: 'Dr Test' }];

      ClinicService.getDoctorsByClinic.mockResolvedValue(doctors);

      await ClinicController.getDoctorsByClinic(req, res);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith(doctors);
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.params = { clinic_id: '1' };

      ClinicService.getDoctorsByClinic.mockRejectedValue(
        new Error('Erro interno'),
      );

      await ClinicController.getDoctorsByClinic(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Erro ao buscar médicos da clínica',
      });
    });
  });

  describe('updateClinic', () => {
    it('deve atualizar clínica com sucesso', async () => {
      req.params = { id: '1' };

      req.body = {
        nome: 'Nova Clínica',
      };

      ClinicService.updateClinic.mockResolvedValue();

      await ClinicController.updateClinic(req, res);

      expect(ClinicService.updateClinic).toHaveBeenCalledWith('1', req.body);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Clínica atualizada com sucesso',
      });
    });

    it('deve retornar 404 em caso de erro', async () => {
      req.params = { id: '1' };

      ClinicService.updateClinic.mockRejectedValue(
        new Error('Erro ao atualizar'),
      );

      await ClinicController.updateClinic(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao atualizar',
      });
    });
  });

  describe('deleteClinic', () => {
    it('deve remover clínica com sucesso', async () => {
      req.params = { id: '1' };

      ClinicService.deleteClinic.mockResolvedValue();

      await ClinicController.deleteClinic(req, res);

      expect(ClinicService.deleteClinic).toHaveBeenCalledWith('1');

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Clínica removida com sucesso',
      });
    });

    it('deve retornar 404 em caso de erro', async () => {
      req.params = { id: '1' };

      ClinicService.deleteClinic.mockRejectedValue(
        new Error('Erro ao remover'),
      );

      await ClinicController.deleteClinic(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao remover',
      });
    });
  });
});
