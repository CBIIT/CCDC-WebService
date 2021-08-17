const express = require("express");
const dataresourceControllers = require("../Controllers/dataresource.controllers");
const router = express.Router();

router.get("/landing", dataresourceControllers.getLanding);
router.post("/search", dataresourceControllers.search);
router.get("/:dataresourceId", dataresourceControllers.getById);

module.exports = router;