const express = require("express");
const examRouter = express.Router();
const multer = require("multer");

const {
  registerValidationRules,
  validate,
  loginValidationRules,
  examCreationValidationRules,
  validateExam,
  textExamCreationValidationRules,
  finalizeExamValidationRules,
  assignExamValidationRules,
} = require("../utils/validate");
const { authMiddleware } = require("../middleware/authMiddleware");
const { teacherMiddleware } = require("../middleware/roleMiddleware");
const {
  createExam,
  createExamWithText,
  finalizeExam,
  getExams,
  getExam,
  updateExam,
  assignExam,
} = require("../controllers/examsController");
const { createExamInDb } = require("../services/createExamInDb");
const upload = multer();

examRouter.post(
  "/create",
  authMiddleware,
  teacherMiddleware,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "questionNum", maxCount: 1 },
    { name: "aditional", maxCount: 1 },
  ]),
  examCreationValidationRules(),
  validateExam,
  createExam
  // createExamInDb
);

examRouter.post(
  "/create-text",
  authMiddleware,
  teacherMiddleware,
  textExamCreationValidationRules(),
  validateExam,
  createExamWithText
);

examRouter.post(
  "/finalize",
  authMiddleware,
  teacherMiddleware,
  finalizeExamValidationRules(),
  validateExam,
  finalizeExam
);

examRouter.get("/", authMiddleware, teacherMiddleware, getExams);

examRouter.get("/:id", authMiddleware, teacherMiddleware, getExam);

examRouter.put("/:id", authMiddleware, teacherMiddleware, updateExam);

examRouter.post("/assign", authMiddleware, teacherMiddleware, assignExam);

module.exports = examRouter;
