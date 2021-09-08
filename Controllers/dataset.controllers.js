const logger = require("../Components/logger");
const cache = require("../Components/cache");
const config = require("../Config");
const path = require("path");
const datasetService = require("../Services/dataset.service");

const search = async (req, res) => {
    const body = req.body;
    let searchText = body.search_text ? body.search_text.trim() : "";
    let filters = body.facet_filters ? body.facet_filters : {};
    let pageInfo = body.pageInfo ? body.pageInfo : {page: 1, pageSize: 10};
    let sort = body.sort ? body.sort : {k: "data_resource_id", v: "asc"};
    let options = {};
    options.pageInfo = pageInfo;
    options.sort = sort;
    const searchResult = await datasetService.search(searchText, filters, options);
    let data = {};
    data.pageInfo = options.pageInfo;
    data.pageInfo.total = searchResult.total;
    data.sort = sort;
    data.result = searchResult.data;
    res.json({status:"success", data: data});
};

const getById = (req, res) => {
  const datasetId = req.params.datasetId;
  res.json({status:"success", data: {
      id: datasetId,
      name: "ds_1"
  }});
};

const getFilters = async (req, res) => {
  let filters = await datasetService.getFilters();
  res.json({status: "success", data: filters});
};

module.exports = {
	search,
	getById,
  getFilters
};