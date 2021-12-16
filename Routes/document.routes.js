const express = require("express");
const documentControllers = require("../Controllers/document.controllers");
const router = express.Router();

router.post("/search", documentControllers.search);

module.exports = router;