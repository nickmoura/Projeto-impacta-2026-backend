import appointmentService from "../services/appointmentService.js";

class AppointmentController {

    async createAppointment(req, res) {
        try {
            const appointment = await appointmentService.createAppointment({
                ...req.body,
                created_by: req.user.id
            })
                

            return res.status(201).json(appointment);
        } catch (error) {
            if (error.message === "todos os campos são obrigatórios") {
                return res.status(400).json({ error: "Todos os campos são obrigatórios" });
            }

            if (error.message === "DUPLICATE_APPOINTEMENT") {
                return res.status(409).json({
                    error: "Já existe um agendamento para este horário"
                });
            }

            console.error(error);

            return res.status(500).json({
                error:"Ërro interno ao criar consulta"
            });
        }
    }
}

export default new AppointmentController();