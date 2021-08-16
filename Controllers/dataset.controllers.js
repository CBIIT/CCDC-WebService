const logger = require("../Components/logger");
const cache = require("../Components/cache");
const config = require("../Config");
const path = require("path");

const search = (req, res) => {
    const body = req.body;
    res.json({
        status:"success", 
        data: [
            {id: "1", name: "ds_1"},
            {id: "2", name: "ds_2"}
        ]
    });
};

const getById = (req, res) => {
    const dataset_id = req.params.dataset_id;
    res.json({status:"success", data: {
        id: dataset_id,
        name: "ds_1"
    }});
};

module.exports = {
	search,
	getById
};