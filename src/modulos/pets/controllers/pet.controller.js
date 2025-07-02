const Pet = require("../models/pet.model");

class PetController {
  // Cadastrar novo pet
  static async cadastrar(req, res) {
    try {
      const { nome_pet, especie, raca, idade, dono_nome, historico_clinico } = req.body;

      if (!nome_pet || !especie || !raca || idade == null || !dono_nome) {
        return res
          .status(400)
          .json({ msg: "Todos os campos obrigatórios devem ser preenchidos!" });
      }

      const novoPet = await Pet.create({
        nome_pet,
        especie,
        raca,
        idade,
        dono_nome,
        historico_clinico: historico_clinico || [] // caso não venha, usa array vazio
      });

      res.status(200).json({ msg: "Pet cadastrado com sucesso", pet: novoPet });
    } catch (error) {
      res.status(500).json({ msg: "Erro ao cadastrar pet", erro: error.message });
    }
  }

  // Buscar todos os pets
  static async listarTodos(req, res) {
    try {
      const pets = await Pet.findAll();
      res.status(200).json(pets);
    } catch (error) {
      res.status(500).json({ msg: "Erro ao buscar pets", erro: error.message });
    }
  }

  // Buscar pet por ID
  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const pet = await Pet.findByPk(id);

      if (!pet) {
        return res.status(404).json({ msg: "Pet não encontrado!" });
      }

      res.status(200).json(pet);
    } catch (error) {
      res.status(500).json({ msg: "Erro ao buscar pet", erro: error.message });
    }
  }

  // Atualizar dados do pet
  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const pet = await Pet.findByPk(id);

      if (!pet) {
        return res.status(404).json({ msg: "Pet não encontrado!" });
      }

      await pet.update(req.body);
      res.status(200).json({ msg: "Pet atualizado com sucesso", pet });
    } catch (error) {
      res.status(500).json({ msg: "Erro ao atualizar pet", erro: error.message });
    }
  }

  // Deletar pet
  static async deletar(req, res) {
    try {
      const { id } = req.params;
      const pet = await Pet.findByPk(id);

      if (!pet) {
        return res.status(404).json({ msg: "Pet não encontrado!" });
      }

      await pet.destroy();
      res.status(200).json({ msg: "Pet deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ msg: "Erro ao deletar pet", erro: error.message });
    }
  }

  // Adicionar nova consulta ao histórico clínico
  static async adicionarConsulta(req, res) {
    try {
      const { id } = req.params;
      const { data, descricao, veterinario } = req.body;

      const pet = await Pet.findByPk(id);
      if (!pet) {
        return res.status(404).json({ msg: "Pet não encontrado!" });
      }

      const novaConsulta = { data, descricao, veterinario };
      const historico = pet.historico_clinico || [];

      historico.push(novaConsulta);

      await pet.update({ historico_clinico: historico });

      res.status(200).json({ msg: "Consulta adicionada com sucesso", historico_clinico: historico });
    } catch (error) {
      res.status(500).json({ msg: "Erro ao adicionar consulta", erro: error.message });
    }
  }
}

module.exports = PetController;
