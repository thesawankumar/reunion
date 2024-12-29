const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  priority: { type: Number, required: true, min: 1, max: 5 },
  status: { type: String, enum: ["pending", "finished"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
});
const taskModel = mongoose.model("task", TaskSchema);
module.exports = taskModel;
