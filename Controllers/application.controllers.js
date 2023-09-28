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

const getGlossaryTerms = async (req, res) => {
  const body = req.body;
  let termNames = body.termNames ? body.termNames : [];

  const result = await applicationService.getGlossaryTerms(termNames);
  res.json({
    status: 'success',
    definitions: result,
  });
};

const getGlossaryTermsByFirstLetter = async (req, res) => {
  const body = req.body;
  let firstLetter = body.firstLetter ? body.firstLetter : '';

  try {
    const terms = await applicationService.getGlossaryTermsByFirstLetter(firstLetter);
    res.status(200);
    res.json({
      status: 'success',
      terms,
    });
  } catch (error) {
    res.status(400);
    res.json({
      status: 'error',
    });
  }
};

const getFirstLettersInGlossary = async (req, res) => {
  const body = req.body;

  try {
    const letters = await applicationService.getFirstLettersInGlossary();
    res.status(200);
    res.json({
      status: 'success',
      letters,
    });
  } catch (error) {
    res.status(500);
    res.json({
      status: 'error',
    });
  }
}

module.exports = {
  version,
  getFirstLettersInGlossary,
  getGlossaryTerms,
  getGlossaryTermsByFirstLetter,
  getSiteUpdate,
  getWidgetUpdate,
};