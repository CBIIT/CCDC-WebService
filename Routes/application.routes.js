const express = require("express");
const applicationControllers = require("../Controllers/application.controllers");
const router = express.Router();

router.get("/version", applicationControllers.version);

module.exports = router;