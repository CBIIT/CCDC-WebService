const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const bodyParser = require('body-parser');
const config = require("./index");

const dataresourceRouter = require("../Routes/dataresource.routes");
const datasetRouter = require("../Routes/dataset.routes");
const documentRouter = require("../Routes/document.routes");
const applicationRouter = require("../Routes/application.routes");

module.exports = function(app) {
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.resolve(config.root, "Public")));
  
  app.use(compression());
  
  app.use(function (req, res, next) {
    const corsWhitelist = [
      "http://localhost:3002",
      "https://datacatalog-dev.ccdi.cancer.gov",
      "https://datacatalog-qa.ccdi.cancer.gov",
      "https://datacatalog-stage.ccdi.cancer.gov",
      "https://datacatalog.ccdi.cancer.gov",
      "https://ccdi-dev.cancer.gov",
      "https://ccdi-qa.cancer.gov",
      "https://ccdi-stage.cancer.gov",
      "https://ccdi.cancer.gov"
    ];
    if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
    }
    // res.header("Access-Control-Allow-Origin", config.orginDomain);
		res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
		res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

		if (next) {
			next();
		}
	});

  //Routers
  app.use("/service/dataresources", dataresourceRouter);
  app.use("/service/datasets", datasetRouter);
  app.use("/service/documents", documentRouter);
  app.use("/service/application", applicationRouter);
  app.get("/service/files/submissiontemplate", (req, res) => {
    res.download("Public/Childhood_Cancer_Data_Catalog_Submission_Template.xlsx");
  });
  app.get("/service/files/userGuide", (req, res) => {
    res.download("Public/User Guide for CCDC v1.1.0.pdf");
  });

  app.get("/", (req, res) => {
    res.send("Hi, welcome to CCDC!");
  });

  app.get("*", (req, res) => {
    res.sendFile("Public/index.html", { root: config.root });
  });

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(createError(404));
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send("Service unavailable for this URL.");
  });
};
