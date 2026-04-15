import PatientService from '../services/patientService.js';

class PatientController {

    async createPatient(req, res) {
        // seu código...
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