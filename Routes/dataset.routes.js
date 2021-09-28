const express = require("express");
const datasetControllers = require("../Controllers/dataset.controllers");
const router = express.Router();

router.post("/search", datasetControllers.search);
router.get("/filters", datasetControllers.getFilters);
router.get("/advancedFilters", datasetControllers.getAdvancedFilters);
router.get("/:datasetId", datasetControllers.getById);


module.exports = router;