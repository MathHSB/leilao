const Sequelize = require("sequelize");
const connection = require("./database");

const Produtos = connection.define("Produtos", {
  produto: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  valor: {
    type: Sequelize.DECIMAL,
    allowNull: false,
  },
});

try {
  Produtos.sync({ force: false });
} catch (err) {
  console.log(err);
}

module.exports = Produtos;
