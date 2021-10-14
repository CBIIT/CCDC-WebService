const config = require("../Config");
const elasticsearch = require("../Components/elasticsearch");
const cache = require("../Components/cache");
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
    cache.setValue(landingKey, randomN, config.itemTTL);
  }

  return randomN;
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

const search = (query) => {
    return [];
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
    getAll,
    search,
    searchById,
};