const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware");
const taskController = require("../controllers/task.controller");

router.post(
  "/create-task",
  [
    body("title").isString().withMessage("Title must be a string"),
    body("startTime").isISO8601().withMessage("Invalid date format"),
    body("endTime").isISO8601().withMessage("Invalid date format"),
    body("priority")
      .isInt({ min: 1, max: 5 })
      .withMessage("Priority must be an integer between 1 and 5"),
    body("status")
      .isIn(["pending", "finished"])
      .withMessage("Status must be either 'pending' or 'finished'"),
  ],
  authMiddleware.authUser,
  taskController.createTask
);

router.get("/all", authMiddleware.authUser, taskController.getTasks);
router.put(
  "/update-task/:id",
  [
    body("title").isString().withMessage("Title must be a string"),
    body("startTime").isISO8601().withMessage("Invalid date format"),
    body("endTime").isISO8601().withMessage("Invalid date format"),
    body("priority")
      .isInt({ min: 1, max: 5 })
      .withMessage("Priority must be an integer between 1 and 5"),
    body("status")
      .isIn(["pending", "finished"])
      .withMessage("Status must be either 'pending' or 'finished'"),
  ],
  authMiddleware.authUser,
  taskController.updateTask
);
router.delete(
  "/delete-task/:id",
  authMiddleware.authUser,
  taskController.deleteTask
);

module.exports = router;
