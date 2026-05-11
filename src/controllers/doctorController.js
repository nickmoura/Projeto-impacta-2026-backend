import doctorService from "../services/doctorService.js";


class DoctorController {

    async createDoctor(req, res) {
        try {
            const data = req.body;

            const doctor = await doctorService.createDoctor(data);

            return res.status(201).json(doctor);
        } catch (error) {

            if (error.code === "EMAIL_ALREADY_EXISTS") {
                return res.status(400).json({
                    message: "O email já está em uso por outro médico"
                });
            }

            return res.status(500).json({
                message: "Erro ao criar médico",
                error: error.message
            });
        }
    }

    async getDoctor(req, res) {
        try {
            const {doctor_id} = req.params;

            const doctor = await doctorService.getDoctor_by_id(doctor_id);

            return res.status(200).json(doctor);
        } catch (error) {
            return res.status(404).json({
                message: "Médico não encontrado"
            });
        }
    }
}

export default new DoctorController();