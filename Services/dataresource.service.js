const config = require("../Config");
const elasticsearch = require("../Components/elasticsearch");
const cache = require("../Components/cache");

const getLanding = () => {
    return [
        {
            id: 1,
            name: "pr_1",
            description: "description_1",
        },
        {
            id: 2,
            name: "pr_2",
            description: "description_2",
        },
        {
            id: 3,
            name: "pr_3",
            description: "description_3",
        },
        {
            id: 4,
            name: "pr_4",
            description: "description_4",
        },
        {
            id: 5,
            name: "pr_5",
            description: "description_5",
        },
    ];
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