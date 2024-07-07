const {
  createExamWithAI,
  createExamWithAIFromText,
} = require("../services/createExamWithAI");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { getTextPrompt } = require("../utils/aiPrompt");
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
module.exports = { createExam, createExamWithText };
