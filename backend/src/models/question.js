const { Model, DataTypes } = require("sequelize");
const db = require("../../config/db");

const Question = db.define("Question", {
  exam_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Exams",
      key: "id",
    },
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isFourOptions(value) {
        if (value.length !== 4) {
          throw new Error("Options must contain exactly 4 elements");
        }
      },
    },
  },
  correct_option: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { Question };
