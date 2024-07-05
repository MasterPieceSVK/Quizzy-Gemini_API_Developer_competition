const db = require("../../config/db");
const { Exam } = require("./exam");
const { Material } = require("./material");
const { Question } = require("./question");
const { Result } = require("./result");
const { User } = require("./user");

try {
  db.authenticate().then(() => {
    console.log("Connection has been established successfully.");
  });
} catch (e) {
  console.log(e);
}

// Associations
User.hasMany(Material, { foreignKey: "user_id" });
Material.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Exam, { foreignKey: "user_id" });
Exam.belongsTo(User, { foreignKey: "user_id" });

Exam.hasMany(Question, { foreignKey: "exam_id" });
Question.belongsTo(Exam, { foreignKey: "exam_id" });

User.hasMany(Result, { foreignKey: "user_id" });
Exam.hasMany(Result, { foreignKey: "exam_id" });
Result.belongsTo(User, { foreignKey: "user_id" });
Result.belongsTo(Exam, { foreignKey: "exam_id" });
if (process.env.NODE_ENV === "development") {
  db.sync() // or { alter: true } for non-destructive updates
    .then(() => {
      console.log("Database & tables created!");
    })
    .catch((e) => {
      console.log("An error occurred while creating the table:", e);
    });
}

module.exports = db;
