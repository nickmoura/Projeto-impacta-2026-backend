// tests/clinicService.test.js

import ClinicService from '../src/services/clinicService.js';
import ClinicModel from '../src/models/clinicModel.js';

jest.mock('../src/models/clinicModel.js');

describe('ClinicService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createClinic', () => {
    it('deve criar clínica com sucesso', async () => {
      ClinicModel.getByCNPJ.mockResolvedValue(null);

      ClinicModel.create.mockResolvedValue(1);

      const data = {
        nome: 'Clinic Test',
        cnpj: '123456789',
      };

      const result = await ClinicService.createClinic(data);

      expect(ClinicModel.getByCNPJ).toHaveBeenCalledWith('123456789');

      expect(ClinicModel.create).toHaveBeenCalledWith({
        nome: 'Clinic Test',
        cnpj: '123456789',
      });

      expect(result).toBe(1);
    });

    it('deve lançar erro quando clínica já existir', async () => {
      ClinicModel.getByCNPJ.mockResolvedValue({
        id: 1,
      });

      const data = {
        nome: 'Clinic Test',
        cnpj: '123456789',
      };

      await expect(ClinicService.createClinic(data)).rejects.toThrow(
        'Clínica já cadastrada',
      );

      expect(ClinicModel.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllClinics', () => {
    it('deve retornar todas as clínicas', async () => {
      const clinics = [{ id: 1 }, { id: 2 }];

      ClinicModel.getAll.mockResolvedValue(clinics);

      const result = await ClinicService.getAllClinics();

      expect(ClinicModel.getAll).toHaveBeenCalled();

      expect(result).toEqual(clinics);
    });
  });

  describe('getClinicById', () => {
    it('deve retornar clínica por id', async () => {
      const clinic = {
        id: 1,
        nome: 'Clinic',
      };

      ClinicModel.getById.mockResolvedValue(clinic);

      const result = await ClinicService.getClinicById(1);

      expect(ClinicModel.getById).toHaveBeenCalledWith(1);

      expect(result).toEqual(clinic);
    });

    it('deve lançar erro quando clínica não existir', async () => {
      ClinicModel.getById.mockResolvedValue(null);

      await expect(ClinicService.getClinicById(1)).rejects.toThrow(
        'Clínica não encontrada',
      );
    });
  });

  describe('getClinicIdByCNPJ', () => {
    it('deve retornar id da clínica', async () => {
      ClinicModel.getByCNPJ.mockResolvedValue({
        id: 10,
      });

      const result = await ClinicService.getClinicIdByCNPJ('123456789');

      expect(ClinicModel.getByCNPJ).toHaveBeenCalledWith('123456789');

      expect(result).toBe(10);
    });

    it('deve lançar erro quando clínica não existir', async () => {
      ClinicModel.getByCNPJ.mockResolvedValue(null);

      await expect(
        ClinicService.getClinicIdByCNPJ('123456789'),
      ).rejects.toThrow('Clínica não encontrada');
    });
  });

  describe('getDoctorsByClinic', () => {
    it('deve retornar médicos da clínica', async () => {
      const doctors = [{ id: 1, nome: 'Dr Test' }];

      ClinicModel.getDoctorsByClinicId.mockResolvedValue(doctors);

      const result = await ClinicService.getDoctorsByClinic(1);

      expect(ClinicModel.getDoctorsByClinicId).toHaveBeenCalledWith(1);

      expect(result).toEqual(doctors);
    });
  });

  describe('updateClinic', () => {
    it('deve atualizar clínica com sucesso', async () => {
      ClinicModel.getById.mockResolvedValue({
        id: 1,
      });

      ClinicModel.update.mockResolvedValue();

      const data = {
        nome: 'Nova Clínica',
      };

      await ClinicService.updateClinic(1, data);

      expect(ClinicModel.getById).toHaveBeenCalledWith(1);

      expect(ClinicModel.update).toHaveBeenCalledWith(1, data);
    });

    it('deve lançar erro quando clínica não existir', async () => {
      ClinicModel.getById.mockResolvedValue(null);

      await expect(ClinicService.updateClinic(1, {})).rejects.toThrow(
        'Clínica não encontrada',
      );

      expect(ClinicModel.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteClinic', () => {
    it('deve deletar clínica com sucesso', async () => {
      ClinicModel.getById.mockResolvedValue({
        id: 1,
      });

      ClinicModel.delete.mockResolvedValue();

      await ClinicService.deleteClinic(1);

      expect(ClinicModel.getById).toHaveBeenCalledWith(1);

      expect(ClinicModel.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar erro quando clínica não existir', async () => {
      ClinicModel.getById.mockResolvedValue(null);

      await expect(ClinicService.deleteClinic(1)).rejects.toThrow(
        'Clinica nao encontrada',
      );

      expect(ClinicModel.delete).not.toHaveBeenCalled();
    });
  });
});
