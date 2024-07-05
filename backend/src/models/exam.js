const { Model, DataTypes } = require("sequelize");
const db = require("../../config/db");

const Exam = db.define("Exam", {
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
});

module.exports = { Exam };
