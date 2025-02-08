const express = require("express");
const router = express.Router();

const AuthController = require("../Controllers/AuthController");




router.post("/login", AuthController.loginUser);


module.exports = router;