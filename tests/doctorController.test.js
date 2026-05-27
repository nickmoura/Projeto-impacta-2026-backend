import doctorController from '../src/controllers/doctorController.js';
import doctorService from '../src/services/doctorService.js';

jest.mock('../src/services/doctorService.js');

describe('DoctorController', () => {
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
      send: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('createDoctor', () => {
    it('deve criar um médico com sucesso', async () => {
      const mockDoctor = {
        id: 1,
        nome: 'Lucas',
        specialty: 'Cardiologia',
      };

      req.body = mockDoctor;

      doctorService.createDoctor.mockResolvedValue(mockDoctor);

      await doctorController.createDoctor(req, res);

      expect(doctorService.createDoctor).toHaveBeenCalledWith(mockDoctor);

      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith(mockDoctor);
    });

    it('deve retornar erro 400 quando email já existir', async () => {
      req.body = {
        email: 'teste@gmail.com',
      };

      doctorService.createDoctor.mockRejectedValue({
        code: 'EMAIL_ALREADY_EXISTS',
      });

      await doctorController.createDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(400);

      expect(res.json).toHaveBeenCalledWith({
        message: 'O email já está em uso por outro médico',
      });
    });

    it('deve retornar erro 500 ao falhar criação', async () => {
      doctorService.createDoctor.mockRejectedValue(new Error('Erro interno'));

      await doctorController.createDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Erro ao criar médico',
        error: 'Erro interno',
      });
    });
  });

  describe('getDoctor', () => {
    it('deve retornar médico por id', async () => {
      const doctor = {
        id: 1,
        nome: 'Lucas',
      };

      req.params.doctor_id = 1;

      doctorService.getDoctor_by_id.mockResolvedValue(doctor);

      await doctorController.getDoctor(req, res);

      expect(doctorService.getDoctor_by_id).toHaveBeenCalledWith(1);

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith(doctor);
    });

    it('deve retornar 404 quando médico não existir', async () => {
      req.params.doctor_id = 1;

      doctorService.getDoctor_by_id.mockRejectedValue(
        new Error('Não encontrado'),
      );

      await doctorController.getDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Médico não encontrado',
        error: 'Não encontrado',
      });
    });
  });

  describe('putDoctor', () => {
    it('deve atualizar médico', async () => {
      const updatedDoctor = {
        specialty: 'Neurologia',
      };

      req.params.doctor_id = 1;
      req.body = updatedDoctor;

      doctorService.putDoctor_by_id.mockResolvedValue(updatedDoctor);

      await doctorController.putDoctor(req, res);

      expect(doctorService.putDoctor_by_id).toHaveBeenCalledWith(
        1,
        updatedDoctor,
      );

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalledWith(updatedDoctor);
    });

    it('deve retornar 404 ao atualizar médico inexistente', async () => {
      doctorService.putDoctor_by_id.mockRejectedValue(
        new Error('Não encontrado'),
      );

      await doctorController.putDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Médico não encontrado',
        error: 'Não encontrado',
      });
    });
  });

  describe('deleteDoctor', () => {
    it('deve deletar médico', async () => {
      req.params.doctor_id = 1;

      doctorService.deleteDoctor_by_id.mockResolvedValue();

      await doctorController.deleteDoctor(req, res);

      expect(doctorService.deleteDoctor_by_id).toHaveBeenCalledWith(1);

      expect(res.status).toHaveBeenCalledWith(204);

      expect(res.send).toHaveBeenCalled();
    });

    it('deve retornar 404 ao deletar médico inexistente', async () => {
      doctorService.deleteDoctor_by_id.mockRejectedValue(
        new Error('Não encontrado'),
      );

      await doctorController.deleteDoctor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Médico não encontrado',
        error: 'Não encontrado',
      });
    });
  });
});
