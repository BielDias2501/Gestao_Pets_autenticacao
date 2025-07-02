const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/configDB");

const Pet = sequelize.define(
  "Pet",
  {
    nome_pet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    especie: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    raca: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "A idade deve ser um número positivo.",
        },
      },
    },
    dono_nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    historico_clinico: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [], // array de objetos representando consultas
    },
  },
  {
    tableName: "pet",
    createdAt: "criado_em",
    updatedAt: "atualizado_em",
  }
);

module.exports = Pet;
