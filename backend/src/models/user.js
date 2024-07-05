const { Model, DataTypes } = require("sequelize");
const db = require("../../config/db");

const User = db.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("teacher", "student"),
    allowNull: false,
  },
});

module.exports = { User };
