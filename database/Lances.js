const Sequelize = require("sequelize");
const connection = require("./database");

const Lances = connection.define("Lances", {
  valorLance: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  pessoa_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  produto_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

Lances.sync({ force: false });

module.exports = Lances;
