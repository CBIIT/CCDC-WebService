/**
 * Client for elasticsearch
 */
const elasticsearch = require('elasticsearch');
const logger = require('./logger');
const config = require('../Config');

var esClient = new elasticsearch.Client({
    host: config.elasticsearch.host + ":" + config.elasticsearch.port,
    log: config.elasticsearch.log,
    requestTimeout: config.elasticsearch.requestTimeout
});

const testConnection = async () => {
    const info = await esClient.ping();

    return info;
};

exports.testConnection = testConnection;

const search = async (index, query) => {
    const {body} = await esClient.search({
        index: index,
        body: query
    });

    return body.hits.hits;
};

exports.search = search;