import Clinic from "../models/ClinicModel.js";

const getClinic = async (req, res) => {
    try {
        const { cnpj } = req.query;

        if (!cnpj) {
            return res.status(400).json({
                error: 'CNPJ é obrigatório'
            });
        }

        const clinic = await Clinic.getClinicByCNPJ(cnpj);

        return res.status(200).json({
            clinic
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Erro ao buscar clínica'
        });
    }
};

export default { getClinic };