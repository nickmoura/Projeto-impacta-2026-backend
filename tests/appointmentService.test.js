import appointmentService from '../src/services/appointmentService.js';
import Appointment from '../src/models/AppointmentModel.js';


jest.mock('../src/models/AppointmentModel.js', () => ({
    createAppointment: jest.fn(),
    getAppointmentByUser: jest.fn(),
    updateAppointmentById: jest.fn(),
    cancelAppointmentById: jest.fn(),
}));

describe("AppointmentService - createAppointment", () => {

    it("deve criar um agendamento com sucesso", async () => {
        const mockData = {
            clinic_id: 1,
            doctor_id: 1,
            patient_id: 1,
            created_by: 1,
            appointment_date: "2024-07-01 14:00:00",
            status: "scheduled"
        };

        Appointment.createAppointment.mockResolvedValue({
            id: 1,
            ...mockData
        });

        const result = await appointmentService.createAppointment(mockData);

        expect(result).toHaveProperty('id');
        expect(Appointment.createAppointment).toHaveBeenCalled();
    });

    it("deve lancar erro se faltar campo", async () => {
        const mockData = {
            clinic_id: 1,
        };

        await expect(
            appointmentService.createAppointment(mockData)
        ).rejects.toThrow("Todos os campos são obrigatórios");
    });

    it("deve lancar erro de duplicidade", async () => {
        const mockData = {
            clinic_id: 1,
            doctor_id: 1,
            patient_id: 1,
            created_by: 1,
            appointment_date: "2024-07-01 14:00:00",
            status: "scheduled"
        };

        Appointment.createAppointment.mockRejectedValue({
            code: "ER_DUP_ENTRY"
        });

        await expect(
            appointmentService.createAppointment(mockData)
        ).rejects.toThrow("DUPLICATE_APPOINTMENT");
    });

    it("deve lancar erro desconhecido", async () => {
        const mockData = {
            clinic_id: 1,
            doctor_id: 1,
            patient_id: 1,
            created_by: 1,
            appointment_date: "2024-07-01 14:00:00",
            status: "scheduled"
        };

        Appointment.createAppointment.mockRejectedValue(new Error("erro aleatorio no banco de dados"));

        await expect(
            appointmentService.createAppointment(mockData)
        ).rejects.toThrow("erro aleatorio no banco de dados");
    });
});

describe("AppointmentService - getAppointmentByUser", () => {

    it("deve retornar consultas do usuário", async () => {
        const mockAppointments = [
            { id: 1, user_id: 1 },
            { id: 2, user_id: 1 }
        ];

        Appointment.getAppointmentByUser.mockResolvedValue(mockAppointments);

        const result = await appointmentService.getAppointmentByUser(1);

        expect(result).toEqual(mockAppointments);
        expect(Appointment.getAppointmentByUser).toHaveBeenCalledWith(1);
    });

    it("deve retornar null se não houver consultas", async () => {
        Appointment.getAppointmentByUser.mockResolvedValue(null);

        const result = await appointmentService.getAppointmentByUser(1);

        expect(result).toBeNull();
    });

    it("deve lançar erro quando falhar", async () => {
        Appointment.getAppointmentByUser.mockRejectedValue(
            new Error("erro no banco")
        );

        await expect(
            appointmentService.getAppointmentByUser(1)
        ).rejects.toThrow("Erro ao buscar consulta");
    });
});

describe("appointmentService - updateAppointmentStatus", () => {
    it("deve atualizar o status com sucesso", async () => {
        Appointment.updateAppointmentById.mockResolvedValue({ id: 1, status: "completed" });  
    });

    it("deve lançar erro se nao passar ID", async () => {
        await expect(
            appointmentService.updateAppointment(null, {})
        ).rejects.toThrow("ID da consulta é obrigatório");
    });

    it("deve lançar erro se nao passar ID", async () => {
        await expect(
            appointmentService.updateAppointment(null, "completed")
        ).rejects.toThrow("ID da consulta é obrigatório");
    });

    it("deve atualizar consulta com sucesso", async () => {
        const updateMock = { id: 1, status: "updated"};

        Appointment.updateAppointmentById.mockResolvedValue(updateMock);

        const result = await appointmentService.updateAppointment(1, {status: "updated"});

        expect(result).toEqual(updateMock);
        expect(Appointment.updateAppointmentById).toHaveBeenCalledWith(1, {status: "updated"});
    });

    it("deve lancar erro de duplicidade ao atualizar", async () => {
        Appointment.updateAppointmentById.mockRejectedValue({
            code: "ER_DUP_ENTRY"
        });

        await expect(
            appointmentService.updateAppointment(1, {})
        ).rejects.toMatchObject({ code: "DUPLICATE_APPOINTMENT" });
    });

    it("deve lancar erro genérico ao atualizar", async () => {
        Appointment.updateAppointmentById.mockRejectedValue(new Error("erro qualquer"));

        await expect(
            appointmentService.updateAppointment(1, {})
        ).rejects.toThrow("erro qualquer");
    });
});

describe("AppointmentService - cancelAppointment", () => {
    it("deve cancelar com sucesso", async () => {
        Appointment.cancelAppointmentById.mockResolvedValue({ id: 1 });

        const result = await appointmentService.cancelAppointment(1);

        expect(result).toEqual({ id: 1 });
    });

    it("deve lancar erro interno quando falhar", async () => {
        Appointment.cancelAppointmentById.mockRejectedValue(
            new Error("error no banco")
        );
        
        await expect(
            appointmentService.cancelAppointment(1)
        ).rejects.toThrow("Erro interno ao cancelar consulta");
    });

    it("deve lancar erro se nao passar ID ao cancelar", async () =>{
        await expect(
            appointmentService.cancelAppointment(null)
        ).rejects.toThrow("ID da consulta é obrigatório");
    });
});