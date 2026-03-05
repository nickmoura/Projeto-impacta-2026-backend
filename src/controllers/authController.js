import User from "../models/UserModel.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registro = async (req, res) => {
    try {
        const { nome, cnpj, email, password } = req.body; 

        if ( !nome || !cnpj || !email || !password ) {
            return res.status(400).json({
                error: 'nome, cnpj, e-mail e senha são obrigatórios'
            });
        }


        const hashpassword = await bcrypt.hash(password, 10); 

        const novousuario = await User.createNewUser(
            nome, 
            cnpj,
            email,
            hashpassword
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
        { id: user.id, email: user.email},
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
