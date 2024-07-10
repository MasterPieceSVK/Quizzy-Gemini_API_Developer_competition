const express = require("express");
const groupsRouter = express.Router();

const {
  validate,
  groupCreationValidationRules,
  validateExam,
  examCreationValidationRules,
} = require("../utils/validate");
const { authMiddleware } = require("../middleware/authMiddleware");
const { teacherMiddleware } = require("../middleware/roleMiddleware");
const {
  createGroup,
  getGroups,
  deleteGroup,
  getUnassignedGroups,
  getGroupsOffline,
} = require("../controllers/groupsController");

groupsRouter.post("/create", authMiddleware, teacherMiddleware, createGroup);

groupsRouter.get("/", authMiddleware, teacherMiddleware, getGroups);
groupsRouter.get(
  "/unassigned/:exam_id",
  authMiddleware,
  teacherMiddleware,
  getGroupsOffline,
  getUnassignedGroups
);

groupsRouter.delete("/:id", authMiddleware, teacherMiddleware, deleteGroup);

module.exports = groupsRouter;
