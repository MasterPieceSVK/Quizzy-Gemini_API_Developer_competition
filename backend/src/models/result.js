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
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Groups", key: "id" },
  },
  score: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  finished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = { Result };
