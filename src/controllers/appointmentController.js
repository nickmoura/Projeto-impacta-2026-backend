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
            
            if (error.message.toLowerCase() === "todos os campos são obrigatórios") {
                return res.status(400).json({ error: "Todos os campos são obrigatórios" });
            }

            if (error.message === "DUPLICATE_APPOINTMENT") {
                return res.status(409).json({
                    error: "Consulta ja existe"
                });
            }

            return res.status(500).json({
                error:"Erro interno ao criar consulta"
            });
        }
    }
}

export default new AppointmentController();