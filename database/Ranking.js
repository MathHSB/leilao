const Sequelize = require("sequelize");
const connection = require("./database");

const Ranking = connection.define("rankings", {
  produto_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  valorLance: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

Ranking.sync({ force: false });

module.exports = Ranking;
