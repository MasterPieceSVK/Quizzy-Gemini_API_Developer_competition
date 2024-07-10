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
const { createGroup, getGroups } = require("../controllers/groupsController");

groupsRouter.post("/create", authMiddleware, teacherMiddleware, createGroup);

groupsRouter.get("/", authMiddleware, teacherMiddleware, getGroups);

module.exports = groupsRouter;
