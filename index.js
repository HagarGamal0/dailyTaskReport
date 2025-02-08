const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Auth = require('./Routes/AuthRoute');
const Task = require('./Routes/TaskRouts');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', Auth)
app.use('/daily', Task)

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});