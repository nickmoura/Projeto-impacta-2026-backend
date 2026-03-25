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

    async getAppointmentByUser(user_id) {
        try {
            const appointment = await Appointment.getAppointmentByUser(user_id);

            return appointment;

        } catch (error) {
            console.error("ERRO NO SERVICE:", error);
            throw new Error("Erro ao buscar consulta");
        }
    }

    async updateAppointment(appointment_id, data) {
        try {
            const appointmment = await Appointment.updateAppointmentById(appointment_id, data);
            return appointmment;
        } catch (error) {
            console.error("ERRO NO SERVICE:", error);
            if (error.code === "ER_DUP_ENTRY" ) {
                throw { code: "DUPLICATE_APPOINTMENT" };
            }
            throw error;
        }
    }

    async cancelAppointment(appointment_id) {

        try {
            const appointment = await Appointment.cancelAppointmentById(appointment_id);

            return appointment;

        } catch (error) {
            console.error("ERRO NO SERVICE:", error);
            throw new Error("Erro interno ao cancelar consulta");
        }
    }
}
export default new AppointmentService();