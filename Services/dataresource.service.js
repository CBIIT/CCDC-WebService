const config = require("../Config");
const elasticsearch = require("../Components/elasticsearch");
const cache = require("../Components/cache");
const mysql = require("../Components/mysql");
const queryGenerator = require("./queryGenerator");
const cacheKeyGenerator = require("./cacheKeyGenerator");
const utils = require("../Utils");

const getLanding = async () => {
  let landingKey = cacheKeyGenerator.landingKey();
  let randomN = cache.getValue(landingKey);
  if(!randomN){
    let dataresourcesAll = await getAll();
    //pick random n, save to landing cache and return
    randomN = utils.getRandom(dataresourcesAll, config.drDisplayAmount);
    cache.setValue(landingKey, randomN, config.itemTTL/6);
  }

  return randomN;
};

const getResourceTotal = async () => {
  let dataresourcesAll = await getAll();
  return dataresourcesAll.length;
};

const getResourcesDatasetsCount = async () => {
  let datasetsCountKey = cacheKeyGenerator.datasetsCountKey();
  let datasetsCount = cache.getValue(datasetsCountKey);
  if(!datasetsCount){
    let sql = "select data_element, element_value, dataset_count from aggragation where data_element = 'Resource'";

    let inserts = [];
    sql = mysql.format(sql, inserts);
    const result = await mysql.query(sql);
    //group by data
    datasetsCount = {};
    if(result.length > 0){
      result.map((kv) => {
        datasetsCount[kv.element_value] = kv.dataset_count;
      });
      cache.setValue(datasetsCountKey, datasetsCount, config.itemTTL);
    }
  }
  return datasetsCount;
};

const getAll = async () => {
  let drKey = cacheKeyGenerator.dataresourcesKey();
  let dataresourcesAll = cache.getValue(drKey);
  if(!dataresourcesAll){
    //querying elasticsearch, save to dataresources cache
    let query = queryGenerator.getDataresourcesQuery();
    let drs = await elasticsearch.search(config.indexDR, query);
    dataresourcesAll = drs.hits.map((dr) => {
      return dr._source;
    });
    cache.setValue(drKey, dataresourcesAll, config.itemTTL);
  }
  return dataresourcesAll;
};

const search = async (filters, options) => {
  let query = queryGenerator.getParticipatingResourcesSearchQuery(filters, options);
  let searchResults = await elasticsearch.search(config.indexDR, query);
  let datasets = searchResults.hits.map((ds) => {
    return ds._source;
  });
  return {total: searchResults.total.value, data : datasets};
};

const getFilters = async () => {
  let filtersKey = cacheKeyGenerator.participatingResourcesFiltersKey();
  let filters = cache.getValue(filtersKey);
  if(!filters){
    //querying elasticsearch, save to dataresources cache
    //let sql = "select lt.term_name as name, lvs.permissible_value as value from lu_terms lt, lu_value_set lvs where lt.id = lvs.term_id and lt.term_name in (?,?,?,?,?,?,?,?,?,?,?,?)";
    let sql = "select data_element, element_value, dataset_count from aggragation where data_element in (?,?)";

    let inserts = [
      "Data Resource Type",
      "Resource Data Content Type"
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
          return secondEL.name < firstEL.name ? 1 : -1;
        });
        filters[k] = tmp.length > config.limitFilterCount ? tmp.slice(0, config.limitFilterCount) : tmp;
      }
      cache.setValue(filtersKey, filters, config.itemTTL);
    }
  }

  return filters;
};

const searchById = async (id) => {
  let dataresourceKey = cacheKeyGenerator.dataresourceKey(id);
  let dataresource = cache.getValue(dataresourceKey);
  if(!dataresource){
    let query = queryGenerator.getDataresourceByIdQuery(id);
    let searchResults = await elasticsearch.search(config.indexDR, query);
    let dataresources = searchResults.hits.map((ds) => {
      return ds._source;
    });
    dataresource = dataresources[0];
    cache.setValue(dataresourceKey, dataresource, config.itemTTL);
  }
  return dataresource;
};

module.exports = {
    getLanding,
    getResourceTotal,
    getAll,
    search,
    getFilters,
    searchById,
};