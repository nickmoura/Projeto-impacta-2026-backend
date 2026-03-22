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
}

export default new AppointmentService();