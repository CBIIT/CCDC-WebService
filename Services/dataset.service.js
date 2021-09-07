const config = require("../Config");
const elasticsearch = require("../Components/elasticsearch");
const cache = require("../Components/cache");
const queryGenerator = require("./queryGenerator");
const cacheKeyGenerator = require("./cacheKeyGenerator");
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

module.exports = {
    search,
    searchById,
};