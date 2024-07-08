const { Sequelize } = require("sequelize");
require("dotenv").config();
const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    connectTimeout: 60000,
  },
});

module.exports = db;
