const Sequelize = require("sequelize");

const connection = new Sequelize(
  "leilao",
  process.env.DB_USERNAME,
  process.env.DB_SENHA,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

module.exports = connection;
