/**
 * Client for elasticsearch
 */
const { Client } = require("@elastic/elasticsearch");
//const { Client } = require("@opensearch-project/opensearch");
const logger = require("./logger");
const config = require("../Config");

const esClient = new Client({
    node: config.elasticsearch.host,
    requestTimeout: config.elasticsearch.requestTimeout
});

/*
const esClient = new Client({
  node: config.elasticsearch.host,
  requestTimeout: config.elasticsearch.requestTimeout
});
*/

const testConnection = async () => {
    const info = await esClient.ping();
    return info;
};

exports.testConnection = testConnection;

const search = async (searchIndex, query) => {
    const result = await esClient.search({
        index: searchIndex,
        body: query
    });
    return result.body.hits;
};

exports.search = search;

const searchWithAggregations = async (searchIndex, query) => {
  const result = await esClient.search({
      index: searchIndex,
      body: query
  });
  return {hits: result.body.hits, aggs: result.body.aggregations};
};

exports.searchWithAggregations = searchWithAggregations;