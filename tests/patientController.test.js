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

it("deve listar pacientes com sucesso", async () => {
    const req = {
        user: { clinic_id: 1 }
    };

    const res = mockResponse();

    PatientService.getPatientsByClinicId.mockResolvedValue([
        { id: 1, nome: "Lucas" }
    ]);

    await PatientController.getPatients(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
        message: "Pacientes listados com sucesso",
        patients: expect.any(Array)
    });
});

it("deve retornar erro se usuário não tiver clínica", async () => {
    const req = { user: {} };
    const res = mockResponse();

    await PatientController.getPatients(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
});

it("deve retornar erro 500", async () => {
    const req = { user: { clinic_id: 1 } };
    const res = mockResponse();

    PatientService.getPatientsByClinicId.mockRejectedValue(new Error("erro"));

    await PatientController.getPatients(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
});
it("deve atualizar paciente com sucesso", async () => {
    const req = {
        params: { patient_id: 1 },
        body: {
            nome: "Lucas",
            email: "lucas@email",
            telefone: "999",
            password: "123"
        }
    };

    const res = mockResponse();

    PatientService.PutPacientById.mockResolvedValue({
        message: "Paciente atualizado com sucesso"
    });

    await PatientController.PutPacientById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
});

it("deve retornar erro se faltar campos", async () => {
    const req = {
        params: {},
        body: {}
    };

    const res = mockResponse();

    await PatientController.PutPacientById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
});

it("deve retornar erro no catch", async () => {
    const req = {
        params: { patient_id: 1 },
        body: {
            nome: "a",
            email: "a",
            telefone: "a",
            password: "a"
        }
    };

    const res = mockResponse();

    PatientService.PutPacientById.mockRejectedValue(new Error("erro"));

    await PatientController.PutPacientById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
});
it("deve atualizar parcialmente", async () => {
    const req = {
        params: { patient_id: 1 },
        body: { nome: "Novo" }
    };

    const res = mockResponse();

    PatientService.patchPatientById.mockResolvedValue({
        message: "ok"
    });

    await PatientController.patchPatient(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
});

it("erro se não tiver id", async () => {
    const req = { params: {}, body: {} };
    const res = mockResponse();

    await PatientController.patchPatient(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
});

it("erro se não enviar nada", async () => {
    const req = {
        params: { patient_id: 1 },
        body: {}
    };

    const res = mockResponse();

    await PatientController.patchPatient(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
});

it("erro no catch", async () => {
    const req = {
        params: { patient_id: 1 },
        body: { nome: "x" }
    };

    const res = mockResponse();

    PatientService.patchPatientById.mockRejectedValue(new Error("erro"));

    await PatientController.patchPatient(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
});

it("deve deletar com sucesso", async () => {
    const req = { params: { id: 1 } };
    const res = mockResponse();

    PatientService.deletePatient.mockResolvedValue(true);

    await PatientController.deletePatient(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
});

it("deve retornar 404 se não encontrar", async () => {
    const req = { params: { id: 1 } };
    const res = mockResponse();

    PatientService.deletePatient.mockResolvedValue(false);

    await PatientController.deletePatient(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
});

it("deve retornar erro 500", async () => {
    const req = { params: { id: 1 } };
    const res = mockResponse();

    PatientService.deletePatient.mockRejectedValue(new Error("erro"));

    await PatientController.deletePatient(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
});