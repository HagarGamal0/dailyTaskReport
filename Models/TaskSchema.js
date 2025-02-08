const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    description: { type: String, required: true },
    fromTime: { type: Date, required: true },
    toTime: { type: Date, required: true }
  });
  
  taskSchema.methods.getDuration = function () {
    const from = new Date(`1970-01-01T${this.fromTime}:00Z`);
    const to = new Date(`1970-01-01T${this.toTime}:00Z`);
    return (to.getTime() - from.getTime()) / (1000 * 60 * 60);
  };
const Task = mongoose.model("Task", taskSchema);
module.exports = Task