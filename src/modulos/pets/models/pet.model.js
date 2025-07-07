const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/configDB');
const bcrypt = require('bcryptjs');

const Pet = sequelize.define(
  'Pet',
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
          msg: 'A idade deve ser um número positivo.',
        },
      },
    },
    dono_nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6],
          msg: 'A senha deve ter no mínimo 6 caracteres.',
        },
      },
    },
    historico_clinico: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    tableName: 'pets',
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',

    hooks: {
      // criptografa a senha antes de criar o registro
      beforeCreate: async (pet) => {
        const salt = await bcrypt.genSalt(10);
        pet.senha = await bcrypt.hash(pet.senha, salt);
      },

      // também criptografa caso atualize a senha
      beforeUpdate: async (pet) => {
        if (pet.changed('senha')) {
          const salt = await bcrypt.genSalt(10);
          pet.senha = await bcrypt.hash(pet.senha, salt);
        }
      },
    },
  }
);

module.exports = Pet;
