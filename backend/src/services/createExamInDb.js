const db = require("../../config/db");
const { Exam } = require("../models/exam");
const { Question } = require("../models/question");

async function createExamInDb(req, res) {
  const transaction = await db.transaction();
  try {
    const exam = await Exam.create(
      {
        user_id: userId,
        title: req.exam.examName,
      },
      { transaction }
    );

    for (const q of req.exam.exam) {
      await Question.create(
        {
          exam_id: exam.id,
          question: q.question,
          options: q.options,
          correct_option: q.correct,
        },
        { transaction }
      );
    }

    await transaction.commit();
    res.send("success");
  } catch (e) {
    if (transaction) {
      await transaction.rollback();
    }
    return res
      .status(500)
      .json({ error: "Error while creating exam in database." });
  }
}

module.exports = { createExamInDb };
