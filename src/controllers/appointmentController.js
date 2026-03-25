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
            console.error("ERRO NO CONTROLLER:", error);

             if (error.code === "DUPLICATE_APPOINTMENT") {
                return res.status(409).json({
                    error: "Horário já ocupado"
                });
            }
            
            if (error.message?.toLowerCase() === "todos os campos são obrigatórios") {
                return res.status(400).json({ error: "Todos os campos são obrigatórios" });
            }

            return res.status(500).json({
                error:"Erro interno ao criar consulta"
            });
        }
    }

    async cancelAppointment(req, res) {
        const { appointment_id } = req.params;

        try {
            const result = await appointmentService.cancelAppointment(appointment_id);

            if (!result) {
                return res.status(404).json({ error: "Consulta não encontrada" });
            }
            else if (result.alreadyCancelled) {
                return res.status(400).json({ error: "Consulta já está cancelada" });
            }
            else return res.status(200).json({ message: "Consulta cancelada com sucesso" });

        } catch (error) {
            console.error("ERRO NO CONTROLLER:", error);
            return res.status(500).json({
                error: "Erro interno ao cancelar consulta"
            });
        }

    }
}

export default new AppointmentController();