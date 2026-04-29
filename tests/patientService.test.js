import PatientController from '../src/controllers/patientController.js';
import PatientService from '../src/services/patientService.js';

import User from '../src/models/UserModel.js';
import Patient from '../src/models/PatientModel.js';
import bcrypt from 'bcrypt';
import pool from '../src/config/db.js';

jest.mock('../src/models/UserModel.js');
jest.mock('../src/models/PatientModel.js');
jest.mock('../src/config/db.js');
jest.mock('bcrypt');



it('deve criar paciente com sucesso', async () => {
    bcrypt.hash.mockResolvedValue('hashedPassword');

    User.createNewUser.mockResolvedValue({ id: 1 });

    Patient.createPatient.mockResolvedValue({
        id: 1,
        nome: "Lucas",
    });

    const result = await PatientService.createPatient({
        nome: "Lucas",
        email: "lucas@email.com",
        telefone: "999999999",
        password: "123456",
        clinic_id: 1
    });

    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);

    expect(User.createNewUser).toHaveBeenCalled();

    expect(Patient.createPatient).toHaveBeenCalledWith(
        "Lucas",
        "lucas@email.com",
        "999999999",
        1
    );

    expect(result).toEqual(expect.any(Object));
});

it('deve lançar erro se faltar campos obrigatórios', async () => {
    await expect(
        PatientService.createPatient({
            nome: "Lucas"
        })
    ).rejects.toThrow("Todos os campos são obrigatórios");
});

it('deve lançar erro EMAIL_ALREADY_EXISTS', async () => {
    bcrypt.hash.mockResolvedValue('hashedPassword');

    User.createNewUser.mockRejectedValue({
        code: "ER_DUP_ENTRY"
    });

    await expect(
        PatientService.createPatient({
            nome: "Lucas",
            email: "lucas@email.com",
            telefone: "99999999",
            password: "123456",
            clinic_id: 1
        })
    ).rejects.toMatchObject({
        code: "EMAIL_ALREADY_EXISTS"
    });
});

it('deve fazer rollback se falhar ao criar paciente', async () => {
    bcrypt.hash.mockResolvedValue('hashedPassword');

    User.createNewUser.mockResolvedValue({ id: 1 });

    Patient.createPatient.mockRejectedValue(new Error("Falha ao criar paciente"));

    pool.query.mockResolvedValue();

    await expect(
        PatientService.createPatient({
            nome: "Lucas",
            email: "lucas@email.com",
            telefone: "99999999",
            password: "123456",
            clinic_id: 1
        })
    ).rejects.toThrow("Falha ao criar paciente");

    expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM User WHERE id = ?",
        [1]
    );
});

it("deve retornar pacientes", async () => {
    pool.query.mockResolvedValue([[{ id: 1 }]]);

    const result = await PatientService.getPatientsByClinicId(1);

    expect(result).toEqual(expect.any(Array));
});

it("deve lançar erro", async () => {
    pool.query.mockRejectedValue(new Error("erro"));

    await expect(
        PatientService.getPatientsByClinicId(1)
    ).rejects.toThrow("erro");
});

it("deve atualizar paciente", async () => {
    Patient.putPatientbyId.mockResolvedValue();
    pool.query.mockResolvedValue([[{ user_id: 1 }]]);
    bcrypt.hash.mockResolvedValue("hash");
    User.putUserById.mockResolvedValue();

    const result = await PatientService.PutPacientById(1, {
        nome: "a",
        email: "a",
        telefone: "a",
        password: "a"
    });

    expect(result.message).toBeDefined();
});

it("deve erro se não encontrar paciente", async () => {
    pool.query.mockResolvedValue([[]]);

    await expect(
        PatientService.PutPacientById(1, {
            nome: "a",
            email: "a",
            telefone: "a",
            password: "a"
        })
    ).rejects.toThrow("Paciente não encontrado");
});

it("deve atualizar parcialmente", async () => {
    pool.query
        .mockResolvedValueOnce([[{ id: 1, nome: "old", telefone: "old", user_id: 1 }]])
        .mockResolvedValueOnce([[{ id: 1, email: "old", password: "123" }]]);

    Patient.putPatientbyId.mockResolvedValue();
    User.putUserById.mockResolvedValue();
    User.getUserByEmail.mockResolvedValue({id: 2});

    const result = await PatientService.patchPatientById(1, { nome: "novo" });

    expect(result.message).toBeDefined();
});

it("deve erro se paciente não existir", async () => {
    pool.query.mockResolvedValue([[]]);

    await expect(
        PatientService.patchPatientById(1, {})
    ).rejects.toThrow("Paciente não encontrado");
});

it("deve erro email duplicado", async () => {
    pool.query
        .mockResolvedValueOnce([[{ id: 1, user_id: 1 }]])
        .mockResolvedValueOnce([[{ id: 1, email: "old" }]]);

    User.getUserByEmail.mockResolvedValue({ id: 2 });

    await expect(
        PatientService.patchPatientById(1, { email: "novo@email" })
    ).rejects.toMatchObject({
        code: "EMAIL_ALREADY_EXISTS"
    });
});

it("deve deletar paciente", async () => {
    Patient.getPatientById.mockResolvedValue({ user_id: 1 });
    User.deleteUserById.mockResolvedValue();

    const result = await PatientService.deletePatient(1);

    expect(result).toBe(true);
});

it("deve retornar false se não encontrar", async () => {
    Patient.getPatientById.mockResolvedValue(null);

    const result = await PatientService.deletePatient(1);

    expect(result).toBe(false);
});

it("deve erro se não passar id", async () => {
    await expect(
        PatientService.deletePatient()
    ).rejects.toThrow("ID do paciente é obrigatório");
});

it('deve lançar erro se campos obrigatórios estiverem faltando', async () => {
    await expect(
        PatientService.createPatient({
            nome: "Lucas"
        })
    ).rejects.toThrow("Todos os campos são obrigatórios");
});