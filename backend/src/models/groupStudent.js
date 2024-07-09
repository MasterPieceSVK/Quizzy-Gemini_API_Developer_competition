const { Model, DataTypes } = require("sequelize");
const db = require("../../config/db");

const GroupStudents = db.define("GroupStudents", {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "id",
    },
    allowNull: false,
  },
  group_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Groups",
      key: "id",
    },
    allowNull: false,
  },
});

module.exports = { GroupStudents };
