const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const authMiddleware = async (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie)
    return res.status(401).json({ error: "Access denied: no cookie" });

  const token = cookie.split("=")[1];

  if (!token) return res.status(401).json({ error: "Access denied: no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { authMiddleware };
