/**
 * Client for elasticsearch
 */
const { Client } = require("@elastic/elasticsearch");
const logger = require("./logger");
const config = require("../Config");

const esClient = new Client({
    node: config.elasticsearch.host,
    requestTimeout: config.elasticsearch.requestTimeout,
    ssl: { rejectUnauthorized: false }
});

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