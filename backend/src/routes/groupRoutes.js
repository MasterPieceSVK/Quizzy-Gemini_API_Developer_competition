const express = require("express");
const groupsRouter = express.Router();

const {
  validate,
  groupCreationValidationRules,
  validateExam,
  examCreationValidationRules,
} = require("../utils/validate");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  teacherMiddleware,
  studentMiddleware,
} = require("../middleware/roleMiddleware");
const {
  createGroup,
  getGroups,
  deleteGroup,
  getUnassignedGroups,
  getGroupsOffline,
  joinGroup,
  getStudentGroups,
  leaveGroup,
} = require("../controllers/groupsController");

groupsRouter.post("/create", authMiddleware, teacherMiddleware, createGroup);
groupsRouter.post("/join", authMiddleware, studentMiddleware, joinGroup);

groupsRouter.get("/", authMiddleware, teacherMiddleware, getGroups);
groupsRouter.get(
  "/students",
  authMiddleware,
  studentMiddleware,
  getStudentGroups
);

groupsRouter.get(
  "/unassigned/:exam_id",
  authMiddleware,
  teacherMiddleware,
  getGroupsOffline,
  getUnassignedGroups
);

groupsRouter.delete("/:id", authMiddleware, teacherMiddleware, deleteGroup);

groupsRouter.post("/leave", authMiddleware, studentMiddleware, leaveGroup);

module.exports = groupsRouter;
