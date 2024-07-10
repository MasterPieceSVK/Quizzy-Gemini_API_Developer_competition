const { Model, DataTypes } = require("sequelize");
const db = require("../../config/db");

const ExamStudent = db.define("GroupStudents", {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "id",
    },
    allowNull: false,
  },
  exam_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Exams",
      key: "id",
    },
    allowNull: false,
  },
  finished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
});

module.exports = { ExamStudent };
