const { Model, DataTypes } = require("sequelize");
const db = require("../../config/db");

const Result = db.define("Result", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  exam_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Exams",
      key: "id",
    },
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = { Result };
