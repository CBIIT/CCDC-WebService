let path = require("path");
let localEnv = require("dotenv");
let _ = require("lodash");

const cfg = localEnv.config();
if (!cfg.error) {
    let tmp = cfg.parsed;
    process.env = {
        ...process.env,
        SOFTWARE_VERSION: tmp.SOFTWARE_VERSION,
        ORIGIN_DOMAIN: tmp.ORIGIN_DOMAIN,
        NODE_ENV: tmp.NODE_ENV,
        PORT: tmp.SERVICE_PORT,
        LOGDIR: tmp.LOGDIR,
        AUTHSECRET: tmp.AUTHSECRET,
        LOG_LEVEL: tmp.LOG_LEVEL,
        RDB_HOST: tmp.RDB_HOST,
        RDB_USER: tmp.RDB_USER,
        RDB_PASSWORD: tmp.RDB_PASSWORD,
        RDB_NAME: tmp.RDB_NAME,
        ES_HOST: tmp.ES_HOST,
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
  logDir: process.env.LOGDIR || "/local/content/ccdc/logs",

  // Node environment (dev, test, stage, prod), must select one.
  env: process.env.NODE_ENV || "prod",

  // software version of the front-end and back-end combined
  softwareVersion: process.env.SOFTWARE_VERSION || "1.0.0",

  //allow origin
  orginDomain: process.env.ORIGIN_DOMAIN || "http://localhost:3001",

  // authentication private key
  authSecret: process.env.authSecret || "123456789",

  // Used by winston logger
  logLevel: process.env.LOG_LEVEL || "silly",

  // index alias name for data resource
  indexDR: "dataresources",

  // index alias name for dataset
  indexDS: "datasets",

  // index alias name for ccdc documents
  indexDoc: "documents",

  //in memory cache ttl
  itemTTL: 24 * 60 * 60,

  //display how many data resources on the landing page
  drDisplayAmount: 10,

  //limit the return count of each of the filters
  limitFilterCount : 30,

  //limit the return count of each of the advanced filters
  limitAdvancedFilterCount: 100,

  //filterable data elements
  filterableFields : [
    "case_age",
    "case_age_at_diagnosis",
    "case_age_at_trial",
    "case_disease_diagnosis",
    "case_ethnicity",
    "case_gender",
    "case_proband",
    "case_race",
    "case_sex",
    "case_sex_at_birth",
    "case_treatment_administered",
    "case_treatment_outcome",
    "case_tumor_site",
    "donor_age",
    "donor_disease_diagnosis",
    "donor_sex",
    "project_anatomic_site",
    "project_cancer_studied",
    "sample_analyte_type",
    "sample_anatomic_site",
    "sample_assay_method",
    "sample_composition_type",
    "sample_repository_name",
    "sample_is_cell_line",
    "sample_is_normal",
    "sample_is_xenograft"
  ],

  //mysql connection
  mysql: {
    connectionLimit: 100, 
    host: process.env.RDB_HOST || "localhost",
    user: process.env.RDB_USER || "root", 
    password : process.env.RDB_PASSWORD || "123456", 
    db : process.env.RDB_NAME || "ccdc"
  },

  //elasticsearch connection
  elasticsearch: {
    host: process.env.ES_HOST || "http://127.0.0.1:9200",
		requestTimeout: 30000
  },

};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(config, {});