const express = require("express");
const multer = require("multer");
const {
  uploadMaterial,
  getMaterials,
  parseMaterial,
} = require("../controllers/materialController");
const { authMiddleware } = require("../middleware/authMiddleware");

const materialRouter = express.Router();
const upload = multer();

materialRouter.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadMaterial
);
materialRouter.get("/", authMiddleware, getMaterials);

module.exports = materialRouter;
