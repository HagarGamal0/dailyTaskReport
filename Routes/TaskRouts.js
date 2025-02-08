const express = require("express");
const TaskController = require("../Controllers/TaskController");

const router = express.Router();

router.post("/tasks", TaskController.createTask);
router.get("/tasks/:employeeId", TaskController.getTasks);
router.get("/task/:id", TaskController.getTask);
router.put("/tasks/:taskId", TaskController.updateTask);
router.delete("/tasks/:taskId", TaskController.deleteTask);
router.get("/summary/:employeeId", TaskController.getDailySummary);

module.exports = router;