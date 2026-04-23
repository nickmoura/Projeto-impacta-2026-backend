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