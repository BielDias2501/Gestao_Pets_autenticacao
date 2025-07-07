// src/modulos/autenticacao/controllers/autenticacaoPet.controller.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const Pet = require("../../pets/models/pet.model");

// tempos de expiração vindos do .env
const tempo_acess_token   = process.env.TEMPO_ACESS_TOKEN;   // ex.: "15m"
const tempo_refresh_token = process.env.TEMPO_REFRESH_TOKEN; // ex.: "1d"

class AutenticacaoPetController {
  // ───────────────────────────────── TOKENs ──────────────────────────────────
  static gerarTokenAcesso(dadosPet) {
    return jwt.sign(dadosPet, process.env.SECRET_KEY, { expiresIn: tempo_acess_token });
  }

  static gerarRefreshToken(dadosPet) {
    return jwt.sign(dadosPet, process.env.SECRET_KEY, { expiresIn: tempo_refresh_token });
  }

  // ─────────────────────────────────── LOGIN ─────────────────────────────────
  static async login(req, res) {
    try {
      const { nome_pet, senha } = req.body;

      if (!nome_pet || !senha) {
        return res.status(400).json({ msg: "Nome do pet e senha são obrigatórios." });
      }

      // procura o pet
      const pet = await Pet.findOne({ where: { nome_pet } });
      if (!pet) {
        return res.status(401).json({ msg: "Pet não encontrado." });
      }

      const senhaCorreta = await bcrypt.compare(senha, pet.senha);
      if (!senhaCorreta) {
        return res.status(400).json({ msg: "Nome do pet ou senha incorretos." });
      }

      // payload enxuto
      const dadosPet = {
        id:   pet.id,
        nome: pet.nome_pet,
        dono: pet.dono_nome
      };

      const tokenAcesso  = AutenticacaoPetController.gerarTokenAcesso(dadosPet);
      const refreshToken =  AutenticacaoPetController.gerarRefreshToken(dadosPet);

      // grava o refreshToken em cookie (ou devolve no corpo, escolha sua política)
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure:   process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge:   24 * 60 * 60 * 1000          // 1 dia
      });

      return res.status(200).json({
        msg: "Pet autenticado com sucesso.",
        tokenAcesso,
        pet: dadosPet
      });

    } catch (err) {
      res.status(500).json({ msg: "Erro interno.", erro: err.message });
    }
  }

  // ─────────────────────────────── REFRESH TOKEN ─────────────────────────────
  static refreshToken(req, res) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(403).json({ msg: "Refresh token ausente." });

    jwt.verify(refreshToken, process.env.SECRET_KEY, (err, pet) => {
      if (err) return res.status(403).json({ msg: "Refresh token inválido." });

      const novoTokenAcesso = this.gerarTokenAcesso({
        id:   pet.id,
        nome: pet.nome,
        dono: pet.dono
      });

      return res.status(200).json({ tokenAcesso: novoTokenAcesso });
    });
  }

  // ─────────────────────────────────── LOGOUT ────────────────────────────────
  static sair(req, res) {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure:   process.env.NODE_ENV !== "development",
        sameSite: "strict"
      });
      return res.status(200).json({ msg: "Logout realizado com sucesso." });
    } catch (err) {
      res.status(500).json({ msg: "Erro interno.", erro: err.message });
    }
  }
}

module.exports = AutenticacaoPetController;
