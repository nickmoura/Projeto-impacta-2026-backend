jest.mock('../src/services/dashboardService.js', () => ({
    fetchDashboardData: jest.fn()
}));

import dashboardController from '../src/controllers/dashboardController';
import dashboardService from '../src/services/dashboardService';


describe('Dashboard Controller', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it('deve retornar dados com sucesso', async () => {
        const mockData = {
            totalUsers: 5,
            lastUsers: [ {
                id: 1, nome: 'Lucas', email: 'lucas@email.com'
            }]
        };

        jest.spyOn(dashboardService, 'fetchDashboardData').mockResolvedValue(mockData);

        await dashboardController(req, res);

        expect(res.json).toHaveBeenCalledWith({
            sucesso: true,
            dados: mockData
        });
    });

    it( 'deve retornar erro 500 se houver excecao', async () => {
        jest.spyOn(dashboardService, 'fetchDashboardData').mockRejectedValue(new Error('Erro de teste'));

        await dashboardController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Erro interno",
            error: "Erro de teste"
        });
    })
});