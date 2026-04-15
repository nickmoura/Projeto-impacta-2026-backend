import PatientService from '../services/patientService.js';

class PatientController {
    async createPatient(req, res) {
        try {
            const {nome, email, telefone, password} = req.body;
            
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

        }catch (error) {
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

    async PutPacientById(req, res) {
        try {
            const { patient_id } = req.params;
            const {nome, email, telefone, password} = req.body;

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
            const {nome, email, telefone, password} = req.body;

            if(!patient_id) {
                return res.status(400).json({
                    message: "ID do paciente é obrigatório"
                });
            }

            if (!nome && !email && !telefone && !password) {
                return res.status(400).json({
                    message: "Pelo menos um campo deve ser enviado"
                });
            }

            const result = await PatientService.patchPatient(patient_id, {
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
}

export default new PatientController();