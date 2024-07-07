const { body, validationResult } = require("express-validator");
const validator = require("validator");
const removeDots = require("../utils/removeDots");
const registerValidationRules = () => {
  return [
    body("username")
      .isLength({ min: 5 })
      .withMessage("Username is required.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Username can only contain letters and numbers."),

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
      .optional()
      .isEmail()
      .withMessage("Valid email is required.")
      .customSanitizer((value) => validator.normalizeEmail(value))
      .customSanitizer((value) => removeDots(value)),
    body("username").optional(),

    body("password").isString(),
  ];
};

const examCreationValidationRules = () => {
  return [
    body("questionNum")
      .customSanitizer((value) => parseInt(value, 10))
      .isInt({ min: 1, max: 20 })
      .withMessage("questionNum must be an integer between 1 and 20."),
  ];
};

const textExamCreationValidationRules = () => {
  return [
    body("questionNum")
      .customSanitizer((value) => parseInt(value, 10))
      .isInt({ min: 1, max: 20 })
      .withMessage("questionNum must be an integer between 1 and 20."),
    body("about").isString().withMessage("about must be a string"),
  ];
};

const validateExam = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const firstError = errors.array()[0].msg;

  return res.status(422).json({
    error: firstError,
  });
};

module.exports = validate;

module.exports = {
  registerValidationRules,
  validate,
  loginValidationRules,
  examCreationValidationRules,
  validateExam,
  textExamCreationValidationRules,
};
