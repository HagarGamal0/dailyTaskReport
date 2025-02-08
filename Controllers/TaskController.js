const Task = require("../Models/TaskSchema");

// Create a Task
const createTask = async (req, res) => {
  try {
    const { employeeId, description, fromTime, toTime } = req.body;

    if (!employeeId || !description || !fromTime || !toTime) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Convert to Date objects in UTC
    const from = new Date(fromTime);
    const to = new Date(toTime);

    if (isNaN(from) || isNaN(to)) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    // Ensure all time calculations are done in UTC
    const duration = (to.getTime() - from.getTime()) / (1000 * 60 * 60); // Convert to hours
    if (duration <= 0 || duration > 8) {
      return res.status(400).json({ message: "Task duration must be between 1 minute and 8 hours." });
    }

    // Set start & end of the day in UTC
    const startOfDay = new Date(from);
    startOfDay.setUTCHours(0, 0, 0, 0);
    console.log(startOfDay)

    const endOfDay = new Date(from);
    endOfDay.setUTCHours(23, 59, 59, 999);
    console.log(endOfDay)

    // Fetch tasks within the same UTC day
    const dailyTasks = await Task.find({
      employeeId,
       fromTime: { $gte: startOfDay, $lte: endOfDay },
    });


    // Calculate total daily hours in UTC
    const totalHours = dailyTasks.reduce((sum, task) => {
      return sum + (new Date(task.toTime).getTime() - new Date(task.fromTime).getTime()) / (1000 * 60 * 60);
    }, 0);
    console.log(totalHours)

    if (totalHours + duration > 8) {
      return res.status(400).json({ message: "Total daily tasks cannot exceed 8 hours." });
    }

    // Save task with UTC timestamps
    const task = await Task.create({ employeeId, description, fromTime, toTime });

    return res.status(201).json({ message: "Task created successfully.", task });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

 const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ employeeId: req.params.employeeId }).populate('employeeId');;
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks", error });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('employeeId');
    // console.log(task)
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks", error });
  }
};



// Update a Task
 const updateTask = async (req, res) => {
  // Update a Task
  try {

    const { employeeId, description, fromTime, toTime } = req.body;
     const currentTask=Task.findById(req.params.id)
     const currentFrom = new Date(currentTask.fromTime)
     const currentTo = new Date(currentTask.toTime)
     const getCurrentDuration = (currentTo.getTime() - currentFrom.getTime()) / (1000 * 60 * 60); // Convert to hours

    // Validate input fields
    if (!employeeId || !description || !fromTime || !toTime) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Convert to Date objects in UTC
    const from = new Date(fromTime);
    const to = new Date(toTime);

    // Validate the date format
    if (isNaN(from) || isNaN(to)) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    // Ensure all time calculations are done in UTC
    const duration = (to.getTime() - from.getTime()) / (1000 * 60 * 60); // Convert to hours
    if (duration <= 0 || duration > 8) {
      return res.status(400).json({ message: "Task duration must be between 1 minute and 8 hours." });
    }

    // Set start & end of the day in UTC
    const startOfDay = new Date(from);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(from);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Fetch tasks within the same UTC day excluding the task being updated
    const dailyTasks = await Task.find({
      employeeId,
      fromTime: { $gte: startOfDay, $lte: endOfDay },
      _id: { $ne: req.params.taskId }, // Exclude the task being updated
    });

    // Calculate total daily hours in UTC
    const totalHours = dailyTasks.reduce((sum, task) => {
      return sum + (new Date(task.toTime).getTime() - new Date(task.fromTime).getTime()) / (1000 * 60 * 60);
    }, 0);

    if (totalHours + duration -getCurrentDuration > 8) {
      return res.status(400).json({ message: "Total daily tasks cannot exceed 8 hours." });
    }

    // Proceed with updating the task
    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ message: "Error updating task", error });
  }
};

// Delete a Task
 const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};

// Get Daily Summary
 const getDailySummary = async (req, res) => {
  try {
    const { employeeId } = req.params; // assuming the employeeId is in the request params

// Set start & end of the day in UTC
const startOfDay = new Date();
startOfDay.setUTCHours(0, 0, 0, 0);

const endOfDay = new Date();
endOfDay.setUTCHours(23, 59, 59, 999);

// Fetch tasks within the same UTC day
const dailyTasks = await Task.find({
  employeeId,
   fromTime: { $gte: startOfDay, $lte: endOfDay },
});


// Calculate total daily hours in UTC
const totalHours = dailyTasks.reduce((sum, task) => {
  return sum + (new Date(task.toTime).getTime() - new Date(task.fromTime).getTime()) / (1000 * 60 * 60);
}, 0);
    const remainingHours = 8 - totalHours;

    res.status(200).json({ totalHours, remainingHours });
  } catch (error) {
    res.status(500).json({ message: "Error fetching summary", error });
  }
};
 

module.exports = {createTask , getTasks , getTask, updateTask ,deleteTask ,getDailySummary}