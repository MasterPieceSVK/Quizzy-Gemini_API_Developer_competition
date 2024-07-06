const { Model, DataTypes } = require("sequelize");
const db = require("../../config/db");

const Material = db.define("Material", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = { Material };
