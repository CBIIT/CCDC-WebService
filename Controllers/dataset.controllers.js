const logger = require("../Components/logger");
const cache = require("../Components/cache");
const config = require("../Config");
const path = require("path");
const { Parser } = require('json2csv');
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

const export2CSV = async (req, res) => {
  const body = req.body;
  let searchText = body.search_text ? body.search_text.trim() : "";
  let filters = body.facet_filters ? body.facet_filters : {};
  let pageInfo = {page: 1, pageSize: 5000};
  let sort = body.sort ? body.sort : {k: "data_resource_id", v: "asc"};
  let options = {};
  options.pageInfo = pageInfo;
  options.sort = sort;
  const searchResult = await datasetService.export2CSV(searchText, filters, options);
  const fields = [
    {
      label: 'Data Resource Name',
      value: 'data_resource_id'
    },
    {
      label: 'Dataset Name',
      value: 'dataset_name'
    },
    {
      label: 'Description',
      value: 'desc'
    },
    {
      label: 'Point of Contact',
      value: 'poc'
    },
    {
      label: 'Point of Contact Email',
      value: 'poc_email'
    },
    {
      label: 'Published In',
      value: 'published_in'
    },
    {
      label: "Number of Cases",
      value: "case_id"
    },
    {
      label: "Number of Samples",
      value: "sample_id"
    },
    {
      label: "Case Disease Diagnosis",
      value: "case_disease_diagnosis"
    }
  ];
  const json2csv = new Parser({ fields });
  const csv = json2csv.parse(searchResult);
  res.header('Content-Type', 'text/csv');
  res.attachment("export.csv");
  res.send(csv);
};

const getById = async (req, res) => {
  const datasetId = req.params.datasetId;
  const searchResult = await datasetService.searchById(datasetId);
  res.json({status:"success", data: searchResult});
};

const getFilters = async (req, res) => {
  let filters = await datasetService.getFilters();
  res.json({status: "success", data: filters});
};

const getAdvancedFilters = async (req, res) => {
  let advancedFilters = await datasetService.getAdvancedFilters();
  res.json({status: "success", data: advancedFilters});
};

module.exports = {
	search,
  export2CSV,
  getFilters,
	getById,
  getAdvancedFilters,
};