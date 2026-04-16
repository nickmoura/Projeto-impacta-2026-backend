import clinicController from "../src/controllers/clinicController.js";
import Clinic from "../src/models/ClinicModel.js";

jest.mock("../src/models/ClinicModel.js", () => ({
    __esModule: true,
    default: {
        getClinicByCNPJ: jest.fn(),
    },
}));

describe("ClinicController - getClinic", () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            query: {
                cnpj: "12345678000123",
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it("deve retornar 400 se CNPJ não for fornecido", async () => {
        req.query = {};

        await clinicController.getClinic(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "CNPJ é obrigatório",
        });
    });

    it("deve retornar a clínica com sucesso", async () => {
        const mockClinic = { id: 1, nome: "Clínica Teste" };
        Clinic.getClinicByCNPJ.mockResolvedValue(mockClinic);

        await clinicController.getClinic(req, res);

        expect(Clinic.getClinicByCNPJ).toHaveBeenCalledWith("12345678000123");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            clinic: mockClinic,
        });
    });

    it("deve retornar 500 se ocorrer erro", async () => {
        Clinic.getClinicByCNPJ.mockRejectedValue(new Error("Erro interno"));

        await clinicController.getClinic(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Erro ao buscar clínica",
        });
    });
});