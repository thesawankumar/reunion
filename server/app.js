const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "./server/.env" });
const app = express();
const taskRoutes = require("./routes/task.routes");
const userRoutes = require("./routes/user.routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
  res.send("hello world");
});
// app.use(express.static(path.join(__dirname, "../frontend/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
// });
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
module.exports = app;
