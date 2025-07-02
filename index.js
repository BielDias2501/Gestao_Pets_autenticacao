const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./src/config/configDB');
const PORTA = process.env.PORTA;
const app = express();
dotenv.config();
app.use(express.json());

const petRoutes = require('./src/modulos/pets/routes/pet.route');
const authRoutes = require('./src/modulos/autenticacao/routes/autenticacao.route');

app.use('/pets', petRoutes);     
app.use('/auth', authRoutes);    


sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
  });
});
