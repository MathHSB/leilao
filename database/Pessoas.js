const Sequelize = require("sequelize");
const connection = require("./database");

const Pessoas = connection.define("Pessoas", {
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  idade: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

Pessoas.sync({ force: false });

module.exports = Pessoas;
