import User from "../models/UserModel.js";
import Clinic from "../models/ClinicModel.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registro = async (req, res) => {
    try {
          const { nome, email, password, cnpj } = req.body; 

        if ( !nome || !email || !password || !cnpj) {
            return res.status(400).json({
                error: 'nome, e-mail, senha e cnpj são obrigatórios'
            });
        }

        const clinic = await Clinic.getClinicByCNPJ(cnpj);
        const clinic_id = clinic.id;


        const hashpassword = await bcrypt.hash(password, 10);

        const role = "user";

        const novousuario = await User.createNewUser(
            nome,
            email,
            hashpassword,
            role,
            clinic_id
        );

        return res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            user:novousuario
        });
       
    } catch(error) {
        console.error(error); 
        return res.status(500).json({
            error: 'Erro ao registrar o usuário'
        });

    }
};

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.login(email, password);

    const token = jwt.sign(
        { id: user.id, email: user.email, clinic_id: user.clinic_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(200).json({ 
        message: "Login realizado com sucesso",
        token
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export { registro, login };
