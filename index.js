const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // necessário para ler cookies
dotenv.config();

const { sequelize } = require('./src/config/configDB');
const petRoutes = require('./src/modulos/pets/routes/pet.route');
const authPetRoutes = require('./src/modulos/autenticacao/routes/autenticacao.route');

const app = express(); // ⬅️ app criado ANTES de usar qualquer app.use()

// Configurações globais
app.use(cors({
    origin: 'http://localhost:5173', // frontend React
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rotas de autenticação do pet (login, logout, refresh)
app.use('/api/auth', authPetRoutes);

// Rotas dos pets (protegidas por token no route file)
app.use('/api/pets', petRoutes);

// Inicialização do servidor
const PORTA = process.env.PORTA || 3001;
app.listen(PORTA, async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');

        await sequelize.sync({ force: true, alter: true });
        console.log('Banco de dados sincronizado com sucesso.');
    } catch (err) {
        console.error('Erro ao conectar ou sincronizar o banco de dados:', err);
    }
    console.log(`Servidor rodando na porta ${PORTA}`);
});
