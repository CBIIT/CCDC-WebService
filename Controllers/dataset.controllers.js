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
    const datasetId = req.params.datasetId;
    res.json({status:"success", data: {
        id: datasetId,
        name: "ds_1"
    }});
};

module.exports = {
	search,
	getById
};