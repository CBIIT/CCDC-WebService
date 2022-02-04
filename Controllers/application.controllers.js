const logger = require("../Components/logger");
const cache = require("../Components/cache");
const config = require("../Config");
const applicationService = require("../Services/application.service");

const version = async (req, res) => {
    const searchResult = await applicationService.getSiteDataUpdate();
    let data = {};
    data.softwareVersion = config.softwareVersion;
    data.siteDataUpdate = searchResult;
    res.json({status:"success", data: data});
};

module.exports = {
  version,
};