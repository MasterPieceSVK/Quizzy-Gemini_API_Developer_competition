const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { Material } = require("../models/material");
const { PDFDocument } = require("pdf-lib");

const uploadMaterial = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file received." });
  }

  const title = req.file.originalname;
  let parsedText = "";

  try {
    if (req.file.mimetype === "application/pdf") {
      const pdfData = await pdfParse(req.file.buffer);
      parsedText = pdfData.text;
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const { value } = await mammoth.extractRawText({
        buffer: req.file.buffer,
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
    const material = await Material.create({
      user_id: req.user.id,
      title,
      content: parsedText,
    });

    res.send("Success");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to upload material" });
  }
};

const getMaterials = async (req, res) => {
  try {
    const materials = await Material.findAll({
      where: { user_id: req.user.id },
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: "Failed to get materials" });
  }
};

module.exports = { uploadMaterial, getMaterials };
