const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const authRouter = require("./src/routes/authRoutes");
const db = require("./config/db");
const materialRouter = require("./src/routes/materialRoutes");
const examRouter = require("./src/routes/examRoutes");
const groupsRouter = require("./src/routes/groupRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

console.log("Testing the database connection..");

try {
  db.authenticate().then(() => {
    console.log("Connection has been established successfully.");
  });

  app.listen(PORT, () => {
    console.log("server listening on port " + PORT);
  });
} catch (error) {
  console.error("Unable to connect to the database:", error.original);
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/auth", authRouter);
app.use("/material", materialRouter);
app.use("/exams", examRouter);
app.use("/groups", groupsRouter);

module.exports.handler = serverless(app);
