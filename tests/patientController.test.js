import PatientController from '../src/controllers/patientController.js';
import PatientService from '../src/services/patientService.js';
import Patient from '../src/models/PatientModel.js';


jest.mock('../src/services/patientService');


const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

it("deve criar paciente com sucesso", async () => {
    const req = {
        body: {
            nome: "Lucas",
            email: "lucas@email",
            telefone: "11999999999",
            password: "123456"
        },
        user: {
            clinic_id: 1
        }
    };

    const res = mockResponse();

    PatientService.createPatient.mockResolvedValue({
        id: 1,
        nome: " Lucas",
    });

    await PatientController.createPatient(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
        message: "Paciente criado com sucesso",
        patient: expect.any(Object)
    });
});

it("deve retornar erro se usuario nao tiver clinica", async () => {
    const req = {
        body: {},
        user: {}
    };

    const res = mockResponse();

    await PatientController.createPatient(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        message: "Usuário autenticado nao esta vinculado a uma clinica"
    });
});

it("deve retornar erro se email ja existir", async () => {
    const req = {
        body: {
            nome: "Lucas",
            email: "lucas@email",
            telefone: "11999999999",
            password: "123456"
        },
        user: {
            clinic_id: 1
        }
    };

    const res = mockResponse();

    PatientService.createPatient.mockRejectedValue({
        code: "EMAIL_ALREADY_EXISTS"
    });

    await PatientController.createPatient(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        message: "O email já está em uso por outro paciente"
    });
});

it("deve retornar erro 500 em caso de falha inesperada", async () => {
    const req = {
        body: {},
        user: {
            clinic_id: 1
        }
    };

    const res = mockResponse();

    PatientService.createPatient.mockRejectedValue(new Error("Erro qualquer"));

    await PatientController.createPatient(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
        message: "Erro ao criar paciente",
        error: "Erro qualquer"
    });
});