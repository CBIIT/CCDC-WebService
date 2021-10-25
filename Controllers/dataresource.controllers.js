const logger = require("../Components/logger");
const cache = require("../Components/cache");
const config = require("../Config");
const path = require("path");
const dataresourceService = require("../Services/dataresource.service");
const datasetService = require("../Services/dataset.service");

const getLanding = async (req, res) => {
    const participatingResources = await dataresourceService.getLanding();
    res.json({status:"success", data: participatingResources});
};


const search = async (req, res) => {
    const body = req.body;
    let filters = body.facet_filters ? body.facet_filters : {};
    let pageInfo = body.pageInfo ? body.pageInfo : {page: 1, pageSize: 15};
    let options = {};
    options.pageInfo = pageInfo;
    const searchResult = await dataresourceService.search(filters, options);
    let data = {};
    data.pageInfo = options.pageInfo;
    data.pageInfo.total = searchResult.total;
    data.result = searchResult.data;
    res.json({status:"success", data: data});
};

const getById = async (req, res) => {
  const dataresourceId = req.params.dataresourceId;
  const searchResult = await dataresourceService.searchById(dataresourceId);
  res.json({status:"success", data: searchResult});
};

const getFilters = async (req, res) => {
  let filters = await dataresourceService.getFilters();
  let result = {};
  result.searchFilters = filters;
  res.json({status: "success", data: result});
};

const getDatasetsById = async (req, res) => {
  const dataresourceId = req.params.dataresourceId;
  const searchResult = await datasetService.searchDatasetsByDataresourceId(dataresourceId);
  res.json({status:"success", data: searchResult});
};

module.exports = {
  getLanding,
	search,
	getById,
  getFilters,
  getDatasetsById,
};