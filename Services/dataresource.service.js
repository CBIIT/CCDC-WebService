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
    //pick random n, save to landing cache and return
    randomN = utils.getRandom(dataresourcesAll, config.drDisplayAmount);
    cache.setValue(landingKey, randomN, config.itemTTL);
  }

  return randomN;
};

const search = (query) => {
    return [];
};

const searchById = (id) => {
    return {};
};

module.exports = {
    getLanding,
    search,
    searchById,
};