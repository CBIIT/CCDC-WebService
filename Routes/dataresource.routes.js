const express = require("express");
const dataresourceControllers = require("../Controllers/dataresource.controllers");
const router = express.Router();

router.get("/landing", dataresourceControllers.getLanding);
router.post("/search", dataresourceControllers.search);
router.get("/all", dataresourceControllers.getAll);
router.get("/filters", dataresourceControllers.getFilters);
router.get("/:dataresourceId/datasets", dataresourceControllers.getDatasetsById);
router.get("/:dataresourceId", dataresourceControllers.getById);

module.exports = router;