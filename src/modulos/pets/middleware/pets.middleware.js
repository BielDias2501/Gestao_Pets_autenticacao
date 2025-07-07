const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

class AutenticacaoMiddleware {
  static autenticarToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ msg: "Token de acesso não fornecido!" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, usuario) => {
      if (err) {
        return res.status(403).json({ msg: "Token inválido ou expirado!" });
      }

      req.usuario = usuario; // informações do token ficam disponíveis no request
      next();
    });
  }
}

module.exports = AutenticacaoMiddleware;
