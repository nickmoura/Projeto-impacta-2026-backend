import Appointment from "../models/AppointmentModel.js";

class AppointmentService {
    async createAppointment(data) {
        const {
            clinic_id,
            doctor_id,
            patient_id,
            created_by,
            appointment_date,
            status
        } = data;

        console.log({
            clinic_id,
            doctor_id,
            patient_id,
            created_by,
            appointment_date,
            status
        });


         if (
            !clinic_id ||
            !doctor_id ||
            !patient_id ||
            !created_by ||
            !appointment_date ||
            !status
        ) {
            throw new Error("Todos os campos são obrigatórios");
        }

        try {
            const appointment =await Appointment.createAppointment(
                clinic_id,
                doctor_id,
                patient_id,
                created_by,
                appointment_date,
                status
            );

            console.log("Consulta criada:", appointment);

            return appointment;

        }catch (error) {

            if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
                const err = new Error("DUPLICATE_APPOINTMENT");
                err.code = "DUPLICATE_APPOINTMENT";
                throw err;
            }

            throw error;
        }   
    }

    async cancelAppointment(req, res) {
        const { appointment_id } = req.params;
        const { motivo_cancelamento } = req.body;

        try {
            const resultado = await this.cancelAppointment(appointment_id, motivo_cancelamento);

            if (!resultado) {
                return res.status(404).json({ error: "Consulta não encontrada" });
            }
            else if (resultado.status === "cancelled") {
                return res.status(400).json({ error: "Consulta já está cancelada" });
            }
            else return res.status(200).json({ message: "Consulta cancelada com sucesso" });    
        } catch (error) {
            console.error("ERRO NO SERVICE:", error);
            throw new Error("Erro interno ao cancelar consulta");
        }
    }
}
export default new AppointmentService();