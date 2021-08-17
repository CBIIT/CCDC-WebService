const express = require("express");
const config = require("./Config");
const logger = require("./Components/logger");
const mysql = require("./Components/mysql");
const elasticsearch = require("./Components/elasticsearch");

const app = express();
require("./Config/express")(app);

const startServer = async function(){
  // Setup server

  try{
    const elasticsearchConnected = await elasticsearch.testConnection();
    if(elasticsearchConnected){
      logger.info("Elasticsearch connected!");
    }
    else{
      logger.info("Failed to connect to Elasticsearch.");
    }
  }
  catch(error) {
    logger.error(error);
  }
  

try{
  const mysqlConnected = await mysql.query("select 1 as c1");
  if(mysqlConnected[0].c1){
    logger.info("Relational DB connected!");
  }
  else{
    logger.info("Failed to connect to Relational Database.");
  }
}
catch(error) {
  logger.error(error);
}

  // Start server
  app.listen(config.port, function () {
    logger.info("Server listening on %d, in %s mode", config.port, config.env);
  });
};

startServer();

// when shutdown signal is received, do graceful shutdown
process.on("SIGINT", function () {
	logger.info("Gracefully shutting down :)");
	mysql.close();
	process.exit();
});