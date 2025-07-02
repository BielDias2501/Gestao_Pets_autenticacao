const jwt = require('jsonwebtoken');
const Pet = require('../../pets/models/pet.model');

class AutenticacaoController {
  static async login(req, res) {
    try {
      const { nome_pet, dono_nome } = req.body;

      if (!nome_pet || !dono_nome) {
        return res.status(400).json({ msg: 'Nome do pet e nome do dono são obrigatórios' });
      }

      const pet = await Pet.findOne({ where: { nome_pet, dono_nome } });

      if (!pet) {
        return res.status(401).json({ msg: 'Pet não encontrado com essas informações' });
      }

      const token = jwt.sign(
        { id: pet.id, nome_pet: pet.nome_pet },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ msg: 'Erro ao autenticar pet', erro: error.message });
    }
  }
}

module.exports = AutenticacaoController;
