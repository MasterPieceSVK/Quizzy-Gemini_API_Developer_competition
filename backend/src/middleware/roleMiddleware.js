const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const teacherMiddleware = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role === "teacher") {
      next();
    } else {
      return res.json({ error: "You are not a teacher. Permission denied." });
    }
  } catch (e) {
    return res.status(500).json({ error: "Error while checking role" });
  }
};

module.exports = { teacherMiddleware };
