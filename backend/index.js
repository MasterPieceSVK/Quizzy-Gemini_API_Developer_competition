const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const authRouter = require("./src/routes/authRoutes");
const db = require("./config/db");
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

app.use(cors());

app.use("/auth", authRouter);

module.exports.handler = serverless(app);
