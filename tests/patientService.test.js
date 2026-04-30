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

it("deve fazer rollback se erro ocorrer após criar user", async () => {
    const userMock = { id: 1 };

    User.createNewUser.mockResolvedValue(userMock);
    Patient.createPatient.mockRejectedValue(new Error("erro qualquer"));

    pool.query.mockResolvedValue([]);

    await expect(
        PatientService.createPatient({
            nome: "Lucas",
            email: "lucas@email.com",
            telefone: "123",
            password: "123",
            clinic_id: 1
        })
    ).rejects.toThrow();

    expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM User WHERE id = ?",
        [1]
    );
});

it("deve lançar erro se paciente não for encontrado no PUT", async () => {
    Patient.putPatientbyId.mockResolvedValue({});

    pool.query.mockResolvedValueOnce([[]]);

    await expect(
        PatientService.PutPacientById(1, {
            nome: "Lucas",
            email: "a@a.com",
            telefone: "123",
            password: "123"
        })
    ).rejects.toThrow("Paciente não encontrado");
});

it("deve lançar erro se email já existir para outro usuário", async () => {
    const patientMock = { id: 1, nome: "Lucas", telefone: "123", user_id: 10 };
    const userMock = { id: 10, email: "old@email.com", password: "123" };

    pool.query
        .mockResolvedValueOnce([[patientMock]]) 
        .mockResolvedValueOnce([[userMock]]); 

    User.getUserByEmail.mockResolvedValue({ id: 999 }); 

    await expect(
        PatientService.patchPatientById(1, {
            email: "novo@email.com"
        })
    ).rejects.toThrow("EMAIL_ALREADY_EXISTS");
});

it('deve atualizar a senha quando password é enviado no patchPatientById', async () => {
        
        pool.query.mockResolvedValueOnce([[
            { 
                id: 5, 
                nome: "Ana", 
                telefone: "11987654321", 
                user_id: 15 
            }
        ]]);

       
        pool.query.mockResolvedValueOnce([[
            { 
                id: 15, 
                email: "ana@email.com", 
                password: "senhaAntigaHash" 
            }
        ]]);

        Patient.putPatientbyId.mockResolvedValue();
        User.putUserById.mockResolvedValue();
        User.getUserByEmail.mockResolvedValue(null); 
        bcrypt.hash.mockResolvedValue('novaSenhaHasheada123');

        const resultado = await PatientService.patchPatientById(5, {
            password: "minhaNovaSenha123" 
        });

        expect(resultado.message).toBe("Paciente atualizado parcialmente com sucesso");

        
        expect(bcrypt.hash).toHaveBeenCalledWith("minhaNovaSenha123", 10);

        
        expect(User.putUserById).toHaveBeenCalledWith(
            15,
            expect.objectContaining({
                password: 'novaSenhaHasheada123'
            })
        );
});

it('deve entrar no if(password) e hashear a senha no patchPatientById', async () => {
        
        pool.query.mockResolvedValueOnce([[
            { id: 8, nome: "João", telefone: "119999", user_id: 25 }
        ]]);

        
        pool.query.mockResolvedValueOnce([[
            { id: 25, email: "joao@email.com", password: "senhaVelha" }
        ]]);

        
        Patient.putPatientbyId.mockResolvedValue();
        User.putUserById.mockResolvedValue();
        User.getUserByEmail.mockResolvedValue(null);

        bcrypt.hash.mockResolvedValue("hashDaNovaSenha123");

        const result = await PatientService.patchPatientById(8, {
            password: "novaSenhaSuperSegura456"   // ← Isso força entrar no if da linha 143
        });

        expect(result.message).toBe("Paciente atualizado parcialmente com sucesso");

        // Verifica se entrou no if(password)
        expect(bcrypt.hash).toHaveBeenCalledWith("novaSenhaSuperSegura456", 10);

        // Verifica se passou a senha hasheada para o User
        expect(User.putUserById).toHaveBeenCalledWith(
            25,
            expect.objectContaining({
                password: "hashDaNovaSenha123"
            })
        );
});

it('deve lançar erro quando faltar dados obrigatórios no PutPacientById ', async () => {
        const invalidData = {
            nome: 'João Silva',
            email: 'joao@test.com',
            telefone: '11999999999'
            
        };

        await expect(
            PatientService.PutPacientById('123', invalidData)
        ).rejects.toThrow("ID do paciente e dados são obrigatórios");
    });

it('deve lançar erro quando patient_id não for informado no patchPatientById', async () => {
        const data = {
            nome: 'João Silva',
            email: 'joao@test.com'
        };

        await expect(
            PatientService.patchPatientById(null, data)   
        ).rejects.toThrow("ID do paciente é obrigatório");
    });

it('deve permitir atualizar quando o email é novo (cobrir else da linha 143)', async () => {
   
    pool.query.mockResolvedValueOnce([
        [{ id: 10, user_id: 100, nome: "Teste", telefone: "11 99999-9999" }]
    ]);

    
    pool.query.mockResolvedValueOnce([
        [{ id: 100, email: "antigo@test.com", password: "hash123" }]
    ]);

   
    User.getUserByEmail.mockResolvedValue(null);

    Patient.putPatientbyId.mockResolvedValue({});
    User.putUserById.mockResolvedValue({});

    const data = {
        nome: "Novo Nome",
        email: "emailnovo@test.com",
        telefone: "11987654321"
    };

    const result = await PatientService.patchPatientById(10, data);

    expect(result).toEqual({
        message: "Paciente atualizado parcialmente com sucesso"
    });
});