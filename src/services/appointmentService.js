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
            const appointment =await Appointment.createAppointement(
                clinic_id,
                doctor_id,
                patient_id,
                created_by,
                appointment_date,
                status
            );

            return appointment;

        }catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                throw new Error("DUPLICATE_APPOINTEMENT");
            }

            throw error;
        }   
    }
}

export default new AppointmentService();