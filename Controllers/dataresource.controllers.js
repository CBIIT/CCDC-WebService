const logger = require("../Components/logger");
const cache = require("../Components/cache");
const config = require("../Config");
const path = require("path");

const search = (req, res) => {
    const body = req.body;
    res.json({
        status:"success", 
        data: [
            {id: "1", name: "dr_1"},
            {id: "2", name: "dr_2"}
        ]
    });
};

const getById = (req, res) => {
    const dataresource_id = req.params.dataresource_id;
    res.json({status:"success", data: {
        id: dataresource_id,
        name: "dr_1"
    }});
};

module.exports = {
	search,
	getById
};