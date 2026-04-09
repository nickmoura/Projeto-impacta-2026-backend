import Patient from "../models/PatientModel.js";


class PatientService {
    async createPatient(data) {
        const  {
            nome, 
            email, 
            endereco, 
            telefone, 
            clinic_id,
        } = data;

        if ( !nome || 
            !email ||
            !telefone || 
            !endereco || 
            !clinic_id 
        ) {
            throw new Error("Todos os campos são obrigatórios");
        }

        try {
            const patient = await Patient.createPatient(
                nome,
                email,
                telefone,
                endereco,
                clinic_id,
            );

            return patient;
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY" || error.error === 1062) {
                const err = new Error("EMAIL_ALREADY_EXISTS");
                err.code = "EMAIL_ALREADY_EXISTS";
                throw err;
            }
            throw error;
        }
    }
}