const logger = require("../Components/logger");
const cache = require("../Components/cache");
const config = require("../Config");
const path = require("path");
const dataresourceService = require("../Services/dataresource.service");

const getLanding = async (req, res) => {
    const participatingResources = await dataresourceService.getLanding();
    res.json({status:"success", data: participatingResources});
};


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
    const dataresourceId = req.params.dataresourceId;
    res.json({status:"success", data: {
        id: dataresourceId,
        name: "dr_1"
    }});
};

module.exports = {
    getLanding,
	search,
	getById
};