const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const teacherMiddleware = async (req, res, next) => {
  const { role } = req.user;
  if (role === "teacher") {
    next();
  } else {
    return res.json({ error: "You are not a teacher. Permission denied." });
  }
};

module.exports = { teacherMiddleware };
