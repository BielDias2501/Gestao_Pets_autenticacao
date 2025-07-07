const express = require('express');
const router = express.Router();
const AutenticacaoPetController = require('../controllers/autenticacao.controller');

// Login do pet
// POST http://localhost:3001/api/auth/login
router.post('/login', AutenticacaoPetController.login);

// Renovar token de acesso com refresh token
// POST http://localhost:3001/api/auth/refresh-token
router.post('/refresh-token', AutenticacaoPetController.refreshToken);

// Logout do pet
// POST http://localhost:3001/api/auth/logout
router.post('/logout', AutenticacaoPetController.sair);

module.exports = router;
