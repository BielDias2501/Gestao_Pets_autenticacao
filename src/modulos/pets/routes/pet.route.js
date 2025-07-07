const express = require("express");
const router = express.Router();
const PetController = require("../controllers/pet.controller");
const AutenticacaoMiddleware = require("../middleware/pets.middleware");

// Listar todos os pets
router.get("/", AutenticacaoMiddleware.autenticarToken, PetController.listarTodos);

// Buscar pet por ID
router.get("/:id", AutenticacaoMiddleware.autenticarToken, PetController.buscarPorId);

// Cadastrar novo pet
router.post("/", PetController.cadastrar);

// Atualizar dados do pet
router.put("/:id", AutenticacaoMiddleware.autenticarToken, PetController.atualizar);

// Deletar pet
router.delete("/:id", AutenticacaoMiddleware.autenticarToken, PetController.deletar);

// Adicionar nova consulta ao histórico
router.post("/:id/consulta", AutenticacaoMiddleware.autenticarToken, PetController.adicionarConsulta);

module.exports = router;
