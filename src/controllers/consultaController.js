const editarConsulta = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;

  return res.status(200).json({
    mensagem: 'Consulta editada com sucesso',
    id,
    dados
  });
};

export default editarConsulta;