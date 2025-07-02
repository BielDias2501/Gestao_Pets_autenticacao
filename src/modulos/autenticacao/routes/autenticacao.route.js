const express = require('express');
const router = express.Router();
const AutenticacaoController = require('../controllers/autenticacao.controller');

// POST /auth/login
router.post('/login', AutenticacaoController.login);

module.exports = router;
