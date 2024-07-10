const {
  createExamWithAI,
  createExamWithAIFromText,
} = require("../services/createExamWithAI");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { getTextPrompt } = require("../utils/aiPrompt");
const { Question } = require("../models/question");
const { Exam } = require("../models/exam");
const { Result } = require("../models/result");

const { Sequelize } = require("sequelize");
const db = require("../../config/db");
const { GroupStudents } = require("../models/groupStudent");
async function createExam(req, res) {
  if (!req.files.file) {
    return res.status(400).json({ error: "No file received." });
  }
  try {
    const { questionNum, aditional } = req.body;
    if (req.files.file[0].mimetype === "application/pdf") {
      const pdfData = await pdfParse(req.files.file[0].buffer);
      parsedText = pdfData.text;
    } else if (
      req.files.file[0].mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const { value } = await mammoth.extractRawText({
        buffer: req.files.file[0].buffer,
      });
      parsedText = value;
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    parsedText = parsedText.replace(/\n/g, "\n").trim();
    if (parsedText == "") {
      return res.status(500).json({
        error:
          "Please provide another document, because we didn't manage to read anything from this one.",
      });
    }

    const exam = await createExamWithAI(parsedText, questionNum, aditional);
    res.json(exam);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to upload material" });
  }
}

async function createExamWithText(req, res) {
  try {
    const { about, questionNum, aditional } = req.body;
    if (!about || !questionNum) {
      return res
        .status(400)
        .json({ error: "about or/and questionNum parameters is/are missing." });
    }

    const exam = await createExamWithAIFromText(about, questionNum, aditional);
    res.json(exam);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Error while creating exam" });
  }
}

async function finalizeExam(req, res) {
  const transaction = await db.transaction();

  try {
    let { data } = req.body;
    data = JSON.parse(data);

    const { name, exam } = data;
    const user_id = req.user.id;

    const newExam = await Exam.create(
      {
        user_id,
        title: name,
      },
      { transaction }
    );

    const questionPromises = exam.map((question) => {
      return Question.create(
        {
          exam_id: newExam.id,
          question: question.question,
          options: question.options,
          correct_option: question.correct,
        },
        { transaction }
      );
    });

    await Promise.all(questionPromises);

    // Commit the transaction
    await transaction.commit();

    res.status(201).json({
      exam: newExam,
      questions: exam,
    });
  } catch (e) {
    await transaction.rollback();
    console.error(e);
    res.status(500).json({ error: "Error while finalizing exam" });
  }
}

async function getExams(req, res) {
  try {
    const user_id = req.user.id;

    const exams = await Exam.findAll({
      where: { user_id },
      order: [["updatedAt", "DESC"]],
    });

    if (!exams || exams.length === 0) {
      return res.status(404).json({ error: "No quizzes found for this user" });
    }

    const examsWithQuestionsCount = [];

    for (const exam of exams) {
      const questionCount = await Question.count({
        where: { exam_id: exam.id },
      });

      const examData = {
        id: exam.id,
        title: exam.title,
        questionCount: questionCount,
      };

      examsWithQuestionsCount.push(examData);
    }

    res.status(200).json(examsWithQuestionsCount);
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ error: "Error while getting exams and question counts" });
  }
}

async function getExam(req, res) {
  try {
    const user_id = req.user.id;

    const exam = await Exam.findByPk(req.params.id, {
      where: { user_id },
    });

    const questions = await Question.findAll({ where: { exam_id: exam.id } });

    if (exam.user_id != user_id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to view this exam" });
    }

    res.json({ exam, questions });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error while getting exam" });
  }
}

async function updateExam(req, res) {
  const transaction = await db.transaction();

  try {
    const user_id = req.user.id;
    const exam_id = req.params.id;
    const data = JSON.parse(req.body.data);

    const exam = await Exam.findByPk(exam_id, {
      where: { user_id },
      transaction,
    });
    if (!exam) {
      await transaction.rollback();
      return res
        .status(403)
        .json({ error: "You are not authorized to update this exam" });
    }

    if (exam.title !== data.name) {
      await exam.update({ title: data.name }, { transaction });
    }

    const questions = data.exam;
    const existingQuestions = await Question.findAll({
      where: { exam_id },
      transaction,
    });

    const existingQuestionIds = existingQuestions.map((q) => q.id);
    const updatedQuestionIds = questions.map((q) => q.id);

    const questionsToDelete = existingQuestionIds.filter(
      (id) => !updatedQuestionIds.includes(id)
    );
    await Question.destroy(
      { where: { id: questionsToDelete } },
      { transaction }
    );

    const questionPromises = questions.map(async (question) => {
      if (question.id) {
        const existingQuestion = await Question.findByPk(question.id, {
          transaction,
        });
        if (existingQuestion) {
          await existingQuestion.update(question, { transaction });
        }
      } else {
        await Question.create(
          {
            exam_id: exam_id,
            question: question.question,
            options: question.options,
            correct_option: question.correct_option,
          },
          { transaction }
        );
      }
    });

    await Promise.all(questionPromises);

    await transaction.commit();
    res.status(200).json({ message: "Exam updated successfully" });
  } catch (e) {
    await transaction.rollback();
    console.log(e);
    res.status(500).json({ error: "Error while updating exam" });
  }
}

async function assignExam(req, res) {
  try {
    console.log(req.body);
    const { group_id, exam_id } = req.body;
    let { user_ids } = req.body;
    if (typeof req.body.group_ids === "string") {
      user_ids = JSON.parse(req.body.user_ids);
    }
    if (!group_id || !user_ids || !exam_id) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    await Promise.all(
      user_ids.map(async (user_id) => {
        const [result, created] = await Result.findOrCreate({
          where: { user_id, exam_id, group_id },
          defaults: { user_id, exam_id, group_id },
        });
        return { result, created };
      })
    );

    res.status(200).json({ message: "Exam successfully assigned to students" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error while assigning exam" });
  }
}

module.exports = {
  createExam,
  createExamWithText,
  finalizeExam,
  getExams,
  getExam,
  updateExam,
  assignExam,
};
