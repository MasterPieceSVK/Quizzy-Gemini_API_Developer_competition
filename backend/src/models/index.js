const db = require("../../config/db");
const { Exam } = require("./exam");
const { Material } = require("./material");
const { Question } = require("./question");
const { Result } = require("./result");
const { User } = require("./user");
const { Group } = require("./group");

try {
  db.authenticate().then(() => {
    console.log("Connection has been established successfully.");
  });
} catch (e) {
  console.log(e);
}

// User and Material relationship
User.hasMany(Material, { foreignKey: "user_id" });
Material.belongsTo(User, { foreignKey: "user_id" });

// User and Exam relationship
User.hasMany(Exam, { foreignKey: "user_id" });
Exam.belongsTo(User, { foreignKey: "user_id" });

// Exam and Question relationship
Exam.hasMany(Question, { foreignKey: "exam_id" });
Question.belongsTo(Exam, { foreignKey: "exam_id" });

// User and Result relationship
User.hasMany(Result, { foreignKey: "user_id" });
Exam.hasMany(Result, { foreignKey: "exam_id" });
Result.belongsTo(User, { foreignKey: "user_id" });
Result.belongsTo(Exam, { foreignKey: "exam_id" });

// User and Group relationship (for students)
User.belongsToMany(Group, {
  through: "GroupStudents",
  foreignKey: "user_id",
  as: "StudentGroups",
});
Group.belongsToMany(User, {
  through: "GroupStudents",
  foreignKey: "group_id",
  as: "Members",
});

// Group and Teacher relationship
Group.belongsTo(User, { foreignKey: "teacher_id", as: "Teacher" });
User.hasMany(Group, { foreignKey: "teacher_id", as: "TeacherGroups" });

if (process.env.NODE_ENV === "development") {
  db.sync({ alter: true })
    .then(() => {
      console.log("Database & tables created!");
    })
    .catch((e) => {
      console.log("An error occurred while creating the table:", e);
    });
}

module.exports = db;
