const config = require("../Config");
const elasticsearch = require("../Components/elasticsearch");
const cache = require("../Components/cache");
const mysql = require("../Components/mysql");
const queryGenerator = require("./queryGenerator");
const cacheKeyGenerator = require("./cacheKeyGenerator");
const dataresourceService = require("./dataresource.service");
const utils = require("../Utils");

const search = async (searchText, filters, options) => {
  let query = queryGenerator.getSearchQuery(searchText, filters, options);
  let searchResults = await elasticsearch.search(config.indexDS, query);
  let datasets = searchResults.hits.map((ds) => {
    return {content: ds._source, highlight: ds.highlight};
  });
  return {total: searchResults.total.value, data : datasets};
};

const searchById = (id) => {
    return {};
};

const getFilters = async () => {
  let filtersKey = cacheKeyGenerator.filtersKey();
  let filters = cache.getValue(filtersKey);
  if(!filters){
    //querying elasticsearch, save to dataresources cache
    let sql = "select lt.term_name as name, lvs.permissible_value as value from lu_terms lt, lu_value_set lvs where lt.id = lvs.term_id and lt.term_name in (?,?,?,?,?,?,?,?,?,?,?,?)";

    let inserts = [
      "Project Cancer Studied",
      "Case Disease Diagnosis",
      "Project Anatomic Site Studied",
      "Case Treatment Administered",
      "Sample Anatomic Site",
      "Sample Assay Method",
      "Sample Analyte Type",
      "Sample Composition Type",
      "Case Age",
      "Case Ethnicity",
      "Case Race",
      "Case Sex at Birth"
    ];
    sql = mysql.format(sql, inserts);
    const result = await mysql.query(sql);
    //group by data
    filters = {};
    if(result.length > 0){
      result.map((kv) => {
        if(!filters[kv.name]){
          filters[kv.name] = [];
        }
        filters[kv.name].push(kv.value);
      });
      //add data resource item
      const dataresourceAll = await dataresourceService.getAll();
      filters["Resource"] = dataresourceAll.map((dr) => {
        return dr.data_resource_id;
      });
      cache.setValue(filtersKey, filters, config.itemTTL);
    }
  }

  return filters;
};

module.exports = {
    search,
    searchById,
    getFilters,
};