const config = require('../Config');
const elasticsearch = require('../Components/elasticsearch');
const cache = require('../Components/cache');

const search = (query) => {
    return [];
}

const searchById = (id) => {
    return {};
}

module.exports = {
    search,
    searchById,
};