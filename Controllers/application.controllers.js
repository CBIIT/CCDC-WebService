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

const getWidgetUpdate = async (req, res) => {
  const result = await applicationService.getWidgetUpdate();
  res.json({status:"success", data: result});
};

const getSiteUpdate = async (req, res) => {
  const body = req.body;
  let pageInfo = body.pageInfo ? body.pageInfo : {page: 1, pageSize: 20};
  if (pageInfo.page !== parseInt(pageInfo.page, 10) || pageInfo.page <= 0) {
    pageInfo.page = 1;
  }
  if (pageInfo.pageSize !== parseInt(pageInfo.pageSize, 10) || pageInfo.pageSize <= 0) {
    pageInfo.pageSize = 20;
  }
  const result = await applicationService.getSiteUpdate(pageInfo);
  res.json({status:"success", data: result});
};

module.exports = {
  version,
  getWidgetUpdate,
  getSiteUpdate,
};