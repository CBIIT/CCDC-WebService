const config = require("../Config");
const elasticsearch = require("../Components/elasticsearch");
const cache = require("../Components/cache");
const queryGenerator = require("./queryGenerator");

const search = async (keyword, options) => {
  let query = queryGenerator.getDocumentSearchQuery(keyword, options);
  let searchResults = await elasticsearch.search(config.indexDoc, query);
  let documents = searchResults.hits.map((ds) => {
    return {content: ds._source, highlight: ds.highlight};
  });
  return {total: searchResults.total.value, data : documents};
};

module.exports = {
    search,
};