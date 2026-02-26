import User from "../controllers/models/UserModel"; 
import bcrypt from "bcrypt";

const registro = async (req, res) => {
    try {
        const { nome, cpf, email, password } = req.body; 

        if ( !nome || !cpf || !email || !password ) {
            return res.status(400).json({
                error: 'nome, cpf, e-mail e senha são obrigatórios'
            });
        }


        const hashpassword = await bcrypt.hash(password, 10); 

        const novousuario = await User.createNewUser(
            nome, 
            cpf,
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

module.exports = {
    registro
};

