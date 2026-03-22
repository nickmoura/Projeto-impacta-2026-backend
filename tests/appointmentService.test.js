import appointmentService from '../src/services/appointmentService.js';
import Appointment from '../src/models/AppointmentModel.js';


jest.mock('../src/models/AppointmentModel.js', () => ({
    createAppointment: jest.fn(),
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