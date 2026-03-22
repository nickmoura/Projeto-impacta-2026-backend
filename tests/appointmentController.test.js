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

    appointmentService.createAppointment.mockRejectedValue(
        new Error("DUPLICATE_APPOINTMENT")
    );

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
