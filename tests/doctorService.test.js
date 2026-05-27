import DoctorService from '../src/services/doctorService.js';
import Doctor from '../src/models/DoctorModel.js';
import Clinic from '../src/models/ClinicModel.js';
import User from '../src/models/UserModel.js';
import bcrypt from 'bcrypt';
import pool from '../src/config/db.js';

jest.mock('bcrypt');

jest.mock('../src/config/db.js', () => ({
  query: jest.fn(),
}));

jest.mock('../src/models/DoctorModel.js', () => ({
  __esModule: true,
  default: {
    createDoctor: jest.fn(),
    getDoctorById: jest.fn(),
    putDoctorById: jest.fn(),
    deleteDoctorById: jest.fn(),
  },
}));

jest.mock('../src/models/UserModel.js', () => ({
  __esModule: true,
  default: {
    createNewUser: jest.fn(),
    deleteUserById: jest.fn(),
    putUserById: jest.fn(),
  },
}));

jest.mock('../src/models/ClinicModel.js', () => ({
  __esModule: true,
  default: {
    getByCNPJ: jest.fn(),
  },
}));

describe('DoctorService', () => {
  const mockDoctorData = {
    name: 'Dr João',
    email: 'teste@test.com',
    telefone: '69999999999',
    password: '123456',
    clinic_cnpj: '123',
    specialty: 'Cardio',
    crm: '9999',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createDoctor', () => {
    it('deve criar médico com sucesso', async () => {
      Clinic.getByCNPJ.mockResolvedValue({
        id: 1,
      });

      bcrypt.hash.mockResolvedValue('senhaHash');

      User.createNewUser.mockResolvedValue({
        id: 10,
      });

      Doctor.createDoctor.mockResolvedValue({
        id: 5,
        crm: '9999',
      });

      const result = await DoctorService.createDoctor(mockDoctorData);

      expect(result).toEqual({
        id: 5,
        crm: '9999',
      });

      expect(Clinic.getByCNPJ).toHaveBeenCalledWith('123');

      expect(User.createNewUser).toHaveBeenCalled();

      expect(Doctor.createDoctor).toHaveBeenCalled();
    });

    it('deve lançar erro se faltar campos', async () => {
      await expect(DoctorService.createDoctor({})).rejects.toThrow(
        'Todos os campos sao obrigatórios',
      );
    });

    it('deve lançar erro se clínica não existir', async () => {
      Clinic.getByCNPJ.mockResolvedValue(null);

      await expect(DoctorService.createDoctor(mockDoctorData)).rejects.toThrow(
        'Clínica não encontrada com o CNPJ fornecido',
      );
    });

    it('deve lançar EMAIL_ALREADY_EXISTS', async () => {
      Clinic.getByCNPJ.mockResolvedValue({
        id: 1,
      });

      bcrypt.hash.mockResolvedValue('hash');

      User.createNewUser.mockRejectedValue({
        code: 'ER_DUP_ENTRY',
        errno: 1062,
      });

      await expect(DoctorService.createDoctor(mockDoctorData)).rejects.toThrow(
        'EMAIL_ALREADY_EXISTS',
      );
    });

    it('deve deletar user se falhar ao criar médico', async () => {
      Clinic.getByCNPJ.mockResolvedValue({
        id: 1,
      });

      bcrypt.hash.mockResolvedValue('hash');

      User.createNewUser.mockResolvedValue({
        id: 99,
      });

      Doctor.createDoctor.mockRejectedValue(new Error('erro'));

      await expect(DoctorService.createDoctor(mockDoctorData)).rejects.toThrow(
        'erro',
      );

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM User WHERE id = ?',
        [99],
      );
    });
  });

  describe('getDoctor_by_id', () => {
    it('deve retornar médico', async () => {
      Doctor.getDoctorById.mockResolvedValue({
        id: 1,
      });

      const result = await DoctorService.getDoctor_by_id(1);

      expect(result).toEqual({
        id: 1,
      });
    });

    it('deve lançar erro se médico não existir', async () => {
      Doctor.getDoctorById.mockResolvedValue(null);

      await expect(DoctorService.getDoctor_by_id(1)).rejects.toThrow(
        'Médico não encontrado',
      );
    });
  });

  describe('putDoctor_by_id', () => {
    it('deve atualizar médico com sucesso', async () => {
      Doctor.getDoctorById
        .mockResolvedValueOnce({
          id: 1,
          user_id: 10,
        })
        .mockResolvedValueOnce({
          id: 1,
          crm: '9999',
        });

      Doctor.putDoctorById.mockResolvedValue();

      User.putUserById.mockResolvedValue();

      const result = await DoctorService.putDoctor_by_id(1, {
        name: 'Lucas',
        email: 'lucas@email.com',
        crm: '9999',
        specialty: 'Cardio',
      });

      expect(result.crm).toBe('9999');
    });

    it('deve atualizar médico com nova senha', async () => {
      Doctor.getDoctorById
        .mockResolvedValueOnce({
          id: 1,
          user_id: 10,
        })
        .mockResolvedValueOnce({
          id: 1,
          crm: '12345',
        });

      bcrypt.hash.mockResolvedValue('senha_hash');

      Doctor.putDoctorById.mockResolvedValue();

      User.putUserById.mockResolvedValue();

      const result = await DoctorService.putDoctor_by_id(1, {
        doctor: 'Lucas',
        email: 'lucas@email.com',
        password: '123456',
        crm: '12345',
        specialty: 'Cardio',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);

      expect(User.putUserById).toHaveBeenCalledWith(
        10,
        expect.objectContaining({
          password: 'senha_hash',
        }),
      );

      expect(result.crm).toBe('12345');
    });

    it('deve lançar erro se médico não existir', async () => {
      Doctor.getDoctorById.mockResolvedValue(null);

      await expect(DoctorService.putDoctor_by_id(1, {})).rejects.toThrow(
        'Médico não encontrado',
      );
    });
  });

  describe('deleteDoctor_by_id', () => {
    it('deve deletar médico com sucesso', async () => {
      Doctor.getDoctorById.mockResolvedValue({
        id: 1,
        user_id: 10,
      });

      Doctor.deleteDoctorById.mockResolvedValue();

      User.deleteUserById.mockResolvedValue();

      await DoctorService.deleteDoctor_by_id(1);

      expect(Doctor.deleteDoctorById).toHaveBeenCalledWith(1);

      expect(User.deleteUserById).toHaveBeenCalledWith(10);
    });

    it('deve lançar erro ao deletar médico inexistente', async () => {
      Doctor.getDoctorById.mockResolvedValue(null);

      await expect(DoctorService.deleteDoctor_by_id(1)).rejects.toThrow(
        'Médico não encontrado',
      );
    });
  });
});
