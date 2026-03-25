import appointmentController from '../src/controllers/appointmentController.js';
import appointmentService from '../src/services/appointmentService.js';

jest.mock('../src/services/appointmentService.js');


const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

it("deve retornar 201 ao criar consulta", async () => {
    const req = {
        body: {
            clinic_id: 1,
            doctor_id: 1,
            patient_id: 1,
            appointment_date: "2024-07-01 14:00:00",
            status: "scheduled"
        },
        user: {
            id: 1
        }
    };

    const res = mockResponse();

    appointmentService.createAppointment.mockResolvedValue({
        id: 1,
        ...req.body
    });

    await appointmentController.createAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1}));
});

it("deve retornar 400 se faltar campo", async () => {
    const req = {
        body: {},
        user: { id: 1}
    };

    const res = mockResponse();

    appointmentService.createAppointment.mockRejectedValue(
        new Error("todos os campos são obrigatórios")
    );

    await appointmentController.createAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
});

it("deve retornar 409 para conflito", async () => {
    const req = {
        body: {},
        user: { id:1 }
    };

    const res = mockResponse();

    const error = new Error("DUPLICATE_APPOINTMENT");
    error.code = "DUPLICATE_APPOINTMENT";

    appointmentService.createAppointment.mockRejectedValue(error);

    await appointmentController.createAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
});

it("deve retornar 500 para erro interno", async () => {
    const req = {
        body: {},
        user: {id: 1}
    };

    const res = mockResponse();

    appointmentService.createAppointment.mockRejectedValue(
        new Error("erro qualquer")
    );

    await appointmentController.createAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
});

it("deve retornar 200 quando result nao tem alredyCancelled", async () => {
    const req = {
        params: {
            appointment_id: '123'
        }
    };
    const res = mockResponse();

    appointmentService.cancelAppointment.mockResolvedValue({});

    await appointmentController.cancelAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
});

it("retorna 404 quando result é null", async () => {
    const req = { params: { appointment_id: '1'}};
    const res = mockResponse();

    appointmentService.cancelAppointment.mockResolvedValue(null);

    await appointmentController.cancelAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ 
        error: "Consulta não encontrada"
    });
});

it("retorna 400 quando result tem alreadyCancelled", async () => {
    const req = { params: { appointment_id: '1'}};
    const res = mockResponse();

    appointmentService.cancelAppointment.mockResolvedValue({ alreadyCancelled: true });

    await appointmentController.cancelAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
        error: "Consulta já está cancelada"
    });
});

it("retorna 200 quando cancelamento é sucesso", async () => {
    const req = { params: { appointment_id: '1'}};
    const res = mockResponse();

    appointmentService.cancelAppointment.mockResolvedValue({
        alreadyCancelled: false
    });

    await appointmentController.cancelAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ 
        message: "Consulta cancelada com sucesso"
    });
});

it("retorna 500 para erro interno", async () => {
    const req = { params: { appointment_id: '1'}};
    const res = mockResponse();

    appointmentService.cancelAppointment.mockRejectedValue(
        new Error("falha inesperada")
    );

    await appointmentController.cancelAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ 
        error: "Erro interno ao cancelar consulta"
    });
});


describe("getAppointments", () => {

    it("deve retornar 200 com lista de consultas", async () => {
        const req = {
            user: { id: 1 }
        };
        const res = mockResponse();

        const mockResult = [
            {
                id: 1,
                appointment_date: "2026-03-20T14:00:00.000Z",
                status: "scheduled"
            }
        ];

        appointmentService.getAppointmentByUser.mockResolvedValue(mockResult);

        await appointmentController.getAppointments(req, res);

        expect(appointmentService.getAppointmentByUser).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("deve retornar 404 quando nao encontrar consultas", async () => {
        const req = {
            user: { id: 1 }
        };
        const res = mockResponse();

        appointmentService.getAppointmentByUser.mockResolvedValue(null);

        await appointmentController.getAppointments(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: "Consulta nao encontrada"
        });
    });

    it("deve retornar 500 em caso de erro interno", async () => {
        const req = {
            user: { id: 1 }
        };
        const res = mockResponse();

        appointmentService.getAppointmentByUser.mockRejectedValue(
            new Error("erro inesperado")
        );

        await appointmentController.getAppointments(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Erro interno ao buscar consulta"
        });
    });

});