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
const {
  teacherMiddleware,
  studentMiddleware,
} = require("../middleware/roleMiddleware");
const {
  createExam,
  createExamWithText,
  finalizeExam,
  getExams,
  getExam,
  updateExam,
  assignExam,
  getStudentAssignedExams,
  getCompletedStudentAssignedExams,
  getQuizQuestionsAndOptions,
  submitExam,
} = require("../controllers/examsController");
const { createExamInDb } = require("../services/createExamInDb");
const {
  getAssignedExams,
  getGroupsOffline,
} = require("../controllers/groupsController");
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

examRouter.get(
  "/assigned",
  authMiddleware,
  teacherMiddleware,
  getGroupsOffline,
  getAssignedExams
);

examRouter.get(
  "/student-assigned",
  authMiddleware,
  studentMiddleware,

  getStudentAssignedExams
);

examRouter.get(
  "/student-completed",
  authMiddleware,
  studentMiddleware,

  getCompletedStudentAssignedExams
);

examRouter.get("/:id", authMiddleware, teacherMiddleware, getExam);

examRouter.put("/:id", authMiddleware, teacherMiddleware, updateExam);

examRouter.post("/assign", authMiddleware, teacherMiddleware, assignExam);

examRouter.get(
  "/take/:exam_id/:group_id",
  authMiddleware,
  studentMiddleware,
  getQuizQuestionsAndOptions
);

examRouter.post("/submit", authMiddleware, studentMiddleware, submitExam);

module.exports = examRouter;
