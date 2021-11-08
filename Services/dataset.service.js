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

const searchById = async (id) => {
  let datasetKey = cacheKeyGenerator.datasetKey(id);
  let dataset = cache.getValue(datasetKey);
  if(!dataset){
    let query = queryGenerator.getDatasetByIdQuery(id);
    let searchResults = await elasticsearch.search(config.indexDS, query);
    let datasets = searchResults.hits.map((ds) => {
      return ds._source;
    });
    dataset = datasets[0];
    cache.setValue(datasetKey, dataset, config.itemTTL);
  }
  return dataset;
};

const getFilters = async () => {
  let filtersKey = cacheKeyGenerator.filtersKey();
  let filters = cache.getValue(filtersKey);
  if(!filters){
    //querying elasticsearch, save to dataresources cache
    //let sql = "select lt.term_name as name, lvs.permissible_value as value from lu_terms lt, lu_value_set lvs where lt.id = lvs.term_id and lt.term_name in (?,?,?,?,?,?,?,?,?,?,?,?)";
    let sql = "select data_element, element_value, dataset_count from aggragation where data_element in (?,?,?,?,?,?,?,?,?,?,?)";

    let inserts = [
      "Case Disease Diagnosis",
      "Case Tumor Site",
      "Case Treatment Administered",
      "Sample Assay Method",
      "Sample Analyte Type",
      "Sample Composition Type",
      "Case Age at Diagnosis",
      "Case Ethnicity",
      "Case Race",
      "Case Sex",
      "Resource"
    ];
    sql = mysql.format(sql, inserts);
    const result = await mysql.query(sql);
    //group by data
    filters = {};
    if(result.length > 0){
      result.map((kv) => {
        if(!filters[kv.data_element]){
          filters[kv.data_element] = [];
        }
        filters[kv.data_element].push({name: kv.element_value, count: kv.dataset_count});
      });
      //sort and top n
      for(let k in filters){
        const tmp = filters[k];
        tmp.sort((firstEL, secondEL) => {
          //return secondEL.count > firstEL.count ? 1 : -1;
          return secondEL.name < firstEL.name ? 1 : -1;
        });
        filters[k] = tmp.length > config.limitFilterCount ? tmp.slice(0, config.limitFilterCount) : tmp;
      }
      cache.setValue(filtersKey, filters, config.itemTTL);
    }
  }

  return filters;
};

const getAdvancedFilters = async () => {
  let advancedFiltersKey = cacheKeyGenerator.advancedFiltersKey();
  let advancedFilters = cache.getValue(advancedFiltersKey);
  if(!advancedFilters){
    //querying elasticsearch, save to dataresources cache
    //let sql = "select lt.term_name as name, lvs.permissible_value as value from lu_terms lt, lu_value_set lvs where lt.id = lvs.term_id and lt.term_name in (?,?,?,?,?,?,?,?,?,?,?,?)";
    let sql = "select data_element, element_value, dataset_count from aggragation where data_element in (?,?,?,?,?,?,?,?,?,?,?,?,?)";

    let inserts = [
      "Case Disease Diagnosis",
      "Case Tumor Site",
      "Case Treatment Administered",
      "Case Treatment Outcome",
      "Sample Anatomic Site",
      "Sample Assay Method",
      "Sample Analyte Type",
      "Sample Composition Type",
      "Sample Is Normal",
      "Case Age at Diagnosis",
      "Case Ethnicity",
      "Case Race",
      "Case Sex"
    ];
    sql = mysql.format(sql, inserts);
    const result = await mysql.query(sql);
    //group by data
    advancedFilters = {};
    if(result.length > 0){
      result.map((kv) => {
        if(!advancedFilters[kv.data_element]){
          advancedFilters[kv.data_element] = [];
        }
        advancedFilters[kv.data_element].push(kv.element_value);
      });
      //add case count
      advancedFilters["Number of Cases"] = [
        "0 - 10 Cases",
        "10 - 100 Cases",
        "100 - 1000 Cases",
        "> 1000 Cases",
      ];
      //add sample count
      advancedFilters["Number of Samples"] = [
        "0 - 10 Samples",
        "10 - 100 Samples",
        "100 - 1000 Samples",
        "> 1000 Samples",
      ];
      //sort and top n
      for(let k in advancedFilters){
        const tmp = advancedFilters[k];
        tmp.sort();
        //advancedFilters[k] = tmp.length > config.limitAdvancedFilterCount ? tmp.slice(0, config.limitAdvancedFilterCount) : tmp;
        advancedFilters[k] = tmp;
      }
      cache.setValue(advancedFiltersKey, advancedFilters, config.itemTTL);
    }
  }

  return advancedFilters;
};

const searchDatasetsByDataresourceId = async (dataresourceId) => {
  let query = queryGenerator.getDatasetsByDataresourceIdQuery(dataresourceId);
  let searchResults = await elasticsearch.search(config.indexDS, query);
  let datasets = searchResults.hits.map((ds) => {
    return ds._source;
  });
  return datasets;
}

module.exports = {
    search,
    searchById,
    getFilters,
    getAdvancedFilters,
    searchDatasetsByDataresourceId,
};