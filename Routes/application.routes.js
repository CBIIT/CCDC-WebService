const express = require("express");
const applicationControllers = require("../Controllers/application.controllers");
const router = express.Router();

router.get("/version", applicationControllers.version);
router.get("/widgetupdate", applicationControllers.getWidgetUpdate);
router.post("/siteupdate", applicationControllers.getSiteUpdate);
router.post('/glossaryTerms', applicationControllers.getGlossaryTerms);
router.post('/glossaryTermsByFirstLetter', applicationControllers.getGlossaryTermsByFirstLetter);
router.get('/glossaryLetters', applicationControllers.getFirstLettersInGlossary);

module.exports = router;
