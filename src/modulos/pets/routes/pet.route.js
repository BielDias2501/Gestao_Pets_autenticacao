const express = require("express");
const router = express.Router();
const PetController = require("../controllers/pet.controller");
const autenticar = require("../middleware/pets.middleware");

// Todas as rotas abaixo exigem autenticação
router.use(autenticar);

// GET /pets - Lista todos os pets
router.get("/", PetController.listarTodos);

// GET /pets/:id - Busca um pet específico pelo ID
router.get("/:id", PetController.buscarPorId);

// POST /pets - Cadastra um novo pet
router.post("/", PetController.cadastrar);

// PUT /pets/:id - Atualiza um pet existente
router.put("/:id", PetController.atualizar);

// DELETE /pets/:id - Remove um pet
router.delete("/:id", PetController.deletar);

// (opcional extra)
// POST /pets/:id/consulta - Adiciona uma nova consulta ao histórico clínico
router.post("/:id/consulta", PetController.adicionarConsulta);

module.exports = router;
