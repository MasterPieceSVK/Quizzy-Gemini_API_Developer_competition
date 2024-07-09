const { Model, DataTypes } = require("sequelize");
const db = require("../../config/db");

const Group = db.define("Group", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "id",
    },
    allowNull: false,
  },
  invite_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = { Group };
