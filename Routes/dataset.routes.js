const express = require("express");
const datasetControllers = require("../Controllers/dataset.controllers");
const router = express.Router();

router.post("/search", datasetControllers.search);
router.get("/:dataset_id", datasetControllers.getById);

module.exports = router