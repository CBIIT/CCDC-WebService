const express = require("express");
const dataresourceControllers = require("../Controllers/dataresource.controllers");
const router = express.Router();

router.get("/landing", dataresourceControllers.getLanding);
router.post("/search", dataresourceControllers.search);
router.get("/:data_resouce_id", dataresourceControllers.getById);

module.exports = router