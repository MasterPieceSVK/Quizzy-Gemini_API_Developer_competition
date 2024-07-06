const express = require("express");
const authRouter = express.Router();
const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/authController");
const {
  registerValidationRules,
  validate,
  loginValidationRules,
} = require("../utils/validate");
const { authMiddleware } = require("../middleware/authMiddleware");

authRouter.post("/register", registerValidationRules(), validate, register);
authRouter.post("/login", loginValidationRules(), validate, login);
authRouter.post("/me", authMiddleware, getCurrentUser);

module.exports = authRouter;
