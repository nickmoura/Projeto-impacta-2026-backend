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
}

export default new PatientController();