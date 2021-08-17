const express = require("express");
const checkAuth = require("../Middleware/checkAuth.middleware");
const userControllers = require("../Controllers/user.controllers");
const router = express.Router();

router.post("/login", userControllers.userLogin);
router.get("/user", checkAuth, userControllers.getUser);

module.exports = router