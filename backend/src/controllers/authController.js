const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

async function register(req, res) {
  const { username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    const token = generateToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000, //  30 days
    });

    res.json({ role: user.role });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      let field = error.errors[0].path;
      return res.status(400).json({ error: `${field} already exists.` });
    }
    console.error(error);
    res.status(500).json({ error: "Error while creating account." });
  }
}

async function login(req, res) {
  const { email, username, password } = req.body;
  try {
    let user;
    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (username) {
      user = await User.findOne({ where: { username } });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.dataValues.password);
    if (match) {
      const token = generateToken(user.id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000, //  30 days
      });
      res.json({ role: user.role });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Login error." });
  }
}

async function getCurrentUser(req, res) {
  if (req.user) {
    res.json({
      username: req.user.username,
      email: req.user.email,
      id: req.user.id,
      role: req.user.role,
    });
  } else {
    res.status(404).json({ error: "User not found." });
  }
}

async function logout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully." });
}

module.exports = { register, login, getCurrentUser, logout };
