let path = require("path");
let localEnv = require("dotenv");
let _ = require("lodash");

const cfg = localEnv.config();
if (!cfg.error) {
    let tmp = cfg.parsed;
    process.env = {
        ...process.env,
        NODE_ENV: tmp.NODE_ENV,
        PORT: tmp.SERVICE_PORT,
        LOGDIR: tmp.LOGDIR,
        AUTHSECRET: tmp.AUTHSECRET,
        LOG_LEVEL: tmp.LOG_LEVEL,
    };
}

// All configurations will extend these options
// ============================================
var config = {
  // Root path of server
  root: path.resolve(__dirname, "../../"),

  // Server port
  port: process.env.PORT || 3000,

  // Server port
  logDir: process.env.LOGDIR || "/local/content/evssip/logs",

  // Node environment (dev, test, stage, prod), must select one.
  env: process.env.NODE_ENV || "prod",

  // authentication private key
  authSecret: process.env.authSecret || "123456789",

  // Used by winston logger
  logLevel: process.env.LOG_LEVEL || "silly",

  // index alias name for data resource
  indexDR: "dataresources",

  // index alias name for dataset
  indexDS: "datasets",

  //in memory cache ttl
  itemTTL: 24 * 60 * 60,

  //display how many data resources on the landing page
  drDisplayAmount: 10,

  //mysql connection
  mysql: {
    connectionLimit: 100, 
    host: process.env.RDB_HOST || "localhost",
    port: process.env.RDB_PORT || 3306,
    user: process.env.RDB_USER || "root", 
    password : process.env.RDB_PASSWORD || "123456", 
    db : "ccdc"
  },

  //elasticsearch connection
  elasticsearch: {
    host: process.env.ES_HOST || "127.0.0.1",
    port: process.env.ES_PORT || 9200,
    log: "error",
		requestTimeout: 30000
  },

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(config, {});