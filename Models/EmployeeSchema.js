const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true }
});

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee