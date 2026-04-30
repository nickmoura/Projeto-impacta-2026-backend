import { fetchDashboardData } from '../src/services/dashboardService.js';
import pool from '../src/config/db.js';


jest.mock('../src/config/db.js', () => ({
  query: jest.fn()
}));

describe('fetchDashboardData', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar totalUsers e lastUsers corretamente', async () => {
   
    pool.query
      .mockResolvedValueOnce([[{ total: 10 }]]) 
      .mockResolvedValueOnce([[
        { id: 1, nome: 'Lucas', email: 'lucas@email.com' },
        { id: 2, nome: 'Ana', email: 'ana@email.com' }
      ]]); 
    const result = await fetchDashboardData();

    expect(result).toEqual({
      totalUsers: 10,
      lastUsers: [
        { id: 1, nome: 'Lucas', email: 'lucas@email.com' },
        { id: 2, nome: 'Ana', email: 'ana@email.com' }
      ]
    });

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT COUNT(*) as total FROM User"
    );
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT id, nome, email FROM User ORDER BY id DESC LIMIT 5"
    );
  });

  it('deve lançar erro se a query falhar', async () => {
    pool.query.mockRejectedValueOnce(new Error('Erro no banco'));

    await expect(fetchDashboardData()).rejects.toThrow('Erro no banco');
  });
});