const taskModel = require("../models/task.models");
const { validationResult } = require("express-validator");

module.exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, startTime, endTime, priority, status } = req.body;
    const userId = req.user._id;

    // Create the task in the database
    const task = await taskModel.create({
      title,
      startTime,
      endTime,
      priority,
      status,
      userId,
    });

    // Calculate the total time (in hours)
    const start = new Date(startTime);
    const end = new Date(endTime);
    const totalTimeInMilliseconds = end - start;
    const totalTimeInHours = (
      totalTimeInMilliseconds /
      (1000 * 60 * 60)
    ).toFixed(2); // Convert milliseconds to hours and round to 2 decimal places

    // Get the next available task_id (you can adjust the logic based on your DB sequence or counter)
    const taskCount = await taskModel.countDocuments(); // Get the total number of tasks
    const taskId = taskCount; // Set task_id as the current count (starting from 1)

    // Send the response with the task object
    res.status(201).json({
      task_id: taskId, // Return task_id as a simple integer starting from 1
      title: task.title,
      priority: task.priority,
      status: task.status,
      startTime: task.startTime,
      endTime: task.endTime,
      totalTime: totalTimeInHours, // Add the calculated total time
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

module.exports.getTasks = async (req, res) => {
  try {
    const {
      status,
      priority,
      sortBy,
      sortOrder = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { userId: req.user.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    // Fetch tasks with filters and pagination
    const tasks = await taskModel
      .find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalTasks = await taskModel.countDocuments(filter);

    // Generate task_id as an incremental integer
    const tasksWithTaskId = tasks.map((task, index) => {
      return {
        task_id: (page - 1) * limit + index + 1, // Sequential task_id starting from 1
        title: task.title,
        priority: task.priority,
        status: task.status,
        startTime: task.startTime,
        endTime: task.endTime,
        totalTime: calculateTotalTime(task.startTime, task.endTime), // Assuming you have this function available
      };
    });

    res.json({ tasks: tasksWithTaskId, totalTasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// Calculate the total time (in hours) as a helper function
const calculateTotalTime = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffInMilliseconds = end - start;
  const totalTimeInHours = (diffInMilliseconds / (1000 * 60 * 60)).toFixed(2); // Convert milliseconds to hours
  return totalTimeInHours;
};

module.exports.updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params; // Get task ID from URL
    const updates = req.body;

    // Convert the task ID to ObjectId if it's not already
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    // Validate status and other fields if needed
    if (updates.status && !["pending", "finished"].includes(updates.status)) {
      return res
        .status(400)
        .json({ message: "Status must be either 'pending' or 'finished'" });
    }

    // Perform the update
    const task = await taskModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id), userId: req.user.id },
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task", error });
  }
};

module.exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const task = await taskModel.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid Task ID", error });
    }
    res.status(500).json({ message: "Error deleting task", error });
  }
};
