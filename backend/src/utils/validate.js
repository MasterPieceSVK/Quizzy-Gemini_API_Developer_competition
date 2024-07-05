const { body, validationResult } = require("express-validator");
const validator = require("validator");
const removeDots = require("../utils/removeDots");
const registerValidationRules = () => {
  return [
    body("username").isLength({ min: 5 }).withMessage("Username is required."),
    body("email")
      .isEmail()
      .withMessage("Valid email is required.")
      .customSanitizer((value) => validator.normalizeEmail(value))
      .customSanitizer((value) => removeDots(value)),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
    body("role")
      .isIn(["student", "teacher"])
      .withMessage("Role must be either 'student' or 'teacher'"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

const loginValidationRules = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Valid email is required.")
      .customSanitizer((value) => validator.normalizeEmail(value))
      .customSanitizer((value) => removeDots(value)),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ];
};

module.exports = { registerValidationRules, validate, loginValidationRules };
