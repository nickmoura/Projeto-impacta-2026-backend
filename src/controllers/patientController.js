import PatientService from '../services/patientService.js';

class PatientController {

    async createPatient(req, res) {
        try {
            const { nome, email, telefone, password } = req.body;

            if (!req.user || !req.user.clinic_id) {
                return res.status(400).json({
                    message: "Usuário autenticado nao esta vinculado a uma clinica"
                });
            }

            const clinic_id = req.user.clinic_id;

            const patient = await PatientService.createPatient({
                nome,
                email,
                telefone,
                password,
                clinic_id
            });

            return res.status(201).json({
                message: "Paciente criado com sucesso",
                patient
            });

        } catch (error) {
            if (error.code === "EMAIL_ALREADY_EXISTS") {
                return res.status(400).json({
                    message: "O email já está em uso por outro paciente"
                });
            }

            return res.status(500).json({
                message: "Erro ao criar paciente",
                error: error.message
            })
        }
    }

    async getPatients(req, res) {

        try {
            if (!req.user || !req.user.clinic_id) {
                return res.status(400).json({
                    message: "Usuário autenticado nao esta vinculado a uma clinica"
                });
            }

            const clinic_id = req.user.clinic_id;

            const patients = await PatientService.getPatientsByClinicId(clinic_id);

            return res.status(200).json({
                message: "Pacientes listados com sucesso",
                patients
            });

        } catch (error) {
            return res.status(500).json({
                message: "Erro ao buscar pacientes",
                error: error.message
            });
        }
    }

    async getPatientsByClinic(req, res) {
        try {
            const { clinic_id } = req.params;

            if (!clinic_id) {
                return res.status(400).json({ message: "clinic_id é obrigatório" });
            }

            const patients = await PatientService.getPatientsByClinicId(Number(clinic_id));

            return res.status(200).json(patients); // retorna array direto, sem wrapper
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao buscar pacientes",
                error: error.message
            });
        }
    }

    async PutPacientById(req, res) {
        try {
            const { patient_id } = req.params;
            const { nome, email, telefone, password } = req.body;

            if (!patient_id || !nome || !email || !telefone || !password) {
                return res.status(400).json({
                    message: "O ID do paciente e todos os campos sáo obrigatórios"
                });
            }

            const result = await PatientService.PutPacientById(patient_id, {
                nome,
                email,
                telefone,
                password
            });

            return res.status(200).json(result);

        } catch (error) {
            return res.status(400).json({
                message: "Erro ao atualizar paciente",
                error: error.message
            });
        }
    }

    async patchPatient(req, res) {
        try {
            const { patient_id } = req.params;
            const { nome, email, telefone, password } = req.body;

            if (!patient_id) {
                return res.status(400).json({
                    message: "ID do paciente é obrigatório"
                });
            }

            if (!nome && !email && !telefone && !password) {
                return res.status(400).json({
                    message: "Pelo menos um campo deve ser enviado"
                });
            }

            const result = await PatientService.patchPatientById(patient_id, {
                nome,
                email,
                telefone,
                password
            });

            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({
                message: "Erro ao atualizar paciente",
                error: error.message
            });
        }
    }

    async deletePatient(req, res) {
        const { id } = req.params;

        try {
            const result = await PatientService.deletePatient(id);

            if (!result) {
                return res.status(404).json({
                    message: "Paciente não encontrado"
                });
            }

            return res.status(200).json({
                message: "Paciente deletado com sucesso"
            });

        } catch (error) {
            console.error("ERRO AO DELETAR PACIENTE:", error);

            return res.status(500).json({
                message: "Erro ao deletar paciente",
                error: error.message
            });
        }
    }
}

export default new PatientController();