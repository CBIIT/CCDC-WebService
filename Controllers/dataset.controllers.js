const logger = require("../Components/logger");
const cache = require("../Components/cache");
const config = require("../Config");
const path = require("path");
const { Parser } = require('json2csv');
const datasetService = require("../Services/dataset.service");

const search = async (req, res) => {
    const body = req.body;
    let searchText = body.search_text ? body.search_text.trim() : "";
    let filters = body.resources_filter ? body.resources_filter : [];
    let pageInfo = body.pageInfo ? body.pageInfo : {page: 1, pageSize: 10};
    let sort = body.sort ? body.sort : {k: "data_resource_id", v: "asc"};
    if (pageInfo.page !== parseInt(pageInfo.page, 10) || pageInfo.page <= 0) {
      pageInfo.page = 1;
    }
    if (pageInfo.pageSize !== parseInt(pageInfo.pageSize, 10) || pageInfo.pageSize <= 0) {
      pageInfo.pageSize = 10;
    }
    if(sort.k === "primary_dataset_scope") {
      sort.name = "Primary Dataset Scope";
      sort.k = "primary_dataset_scope";
    } else if (sort.k === "dataset_name.raw") {
      sort.name = "Dataset";
      sort.k = "dataset_name.raw";
    } else if (sort.k === "case_id") {
      sort.name = "Cases";
      sort.k = "case_id";
    } else if (sort.k === "sample_id") {
      sort.name = "Samples";
      sort.k = "sample_id";
    } else {
      sort.name = "Resource";
      sort.k = "data_resource_id";
    }
    if(!sort.v || ["asc", "desc"].indexOf(sort.v) === -1) {
      sort.v = "asc";
    }
    let options = {};
    options.pageInfo = pageInfo;
    options.sort = sort;
    const searchResult = await datasetService.search(searchText, filters, options);
    let data = {};
    if (searchResult.total !== 0 && (options.pageInfo.page - 1) * options.pageInfo.pageSize >= searchResult.total) {
      let lastPage = Math.ceil(searchResult.total / options.pageInfo.pageSize);
      options.pageInfo.page = lastPage;
      const searchResultAgain = await datasetService.search(searchText, filters, options);
      data.pageInfo = options.pageInfo;
      data.pageInfo.total = searchResultAgain.total;
      data.sort = sort;
      data.result = searchResultAgain.data;
      data.aggs = searchResultAgain.aggs;
    } else {
      data.pageInfo = options.pageInfo;
      data.pageInfo.total = searchResult.total;
      data.sort = sort;
      data.result = searchResult.data;
      data.aggs = searchResult.aggs;
    }
    res.json({status:"success", data: data});
};

const export2CSV = async (req, res) => {
  const body = req.body;
  let searchText = body.search_text ? body.search_text.trim() : "";
  let pageInfo = {page: 1, pageSize: 5000};
  let sort = body.sort ? body.sort : {k: "data_resource_id", v: "asc"};
  let options = {};
  options.pageInfo = pageInfo;
  options.sort = sort;
  const searchResult = await datasetService.export2CSV(searchText, options);
  const fields = [
    {
      label: 'Resource',
      value: 'data_resource_id'
    },
    {
      label: 'Dataset',
      value: 'dataset_name'
    },
    {
      label: 'Description',
      value: 'desc'
    },
    {
      label: 'Primary Dataset Scope',
      value: 'primary_dataset_scope'
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
    },
    {
      label: "Case Age at Diagnosis",
      value: "case_age_at_diagnosis"
    },
    {
      label: "Case Ethnicity",
      value: "case_ethnicity"
    },
    {
      label: "Case Race",
      value: "case_race"
    },
    {
      label: "Case Sex",
      value: "case_sex"
    },
    {
      label: "Case Tumor Site",
      value: "case_tumor_site"
    },
    {
      label: "Case Treatment Administered",
      value: "case_treatment_administered"
    },
    {
      label: "Case Treatment Outcome",
      value: "case_treatment_outcome"
    },
    {
      label: "Sample Assay Method",
      value: "sample_assay_method"
    },
    {
      label: "Sample Analyte Type",
      value: "sample_analyte_type"
    },
    {
      label: "Additional Data",
      value: "additional"
    },
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