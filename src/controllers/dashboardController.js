import { fetchDashboardData } from '../services/dashboardService.js';

async function dashboardController(req, res) {
    try {
        const dadosExternos =await fetchDashboardData();

        return res.json({
            sucesso: true,
            dados: dadosExternos
        });
    } catch (err) {
        return res.status(500).json({ 
            message: "Erro interno",
            error: err.message
         });
    }
}

export default dashboardController;