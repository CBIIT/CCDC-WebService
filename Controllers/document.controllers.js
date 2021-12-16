const logger = require("../Components/logger");
const cache = require("../Components/cache");
const config = require("../Config");
const documentService = require("../Services/document.service");

const search = async (req, res) => {
    const body = req.body;
    let keyword = body.keyword ? body.keyword : "";
    let pageInfo = body.pageInfo ? body.pageInfo : {page: 1, pageSize: 10, total: 0};
    let options = {};
    options.pageInfo = pageInfo;
    const searchResult = await documentService.search(keyword, options);
    let data = {};
    data.pageInfo = options.pageInfo;
    data.pageInfo.total = searchResult.total;
    data.result = searchResult.data;
    res.json({status:"success", data: data});
};

module.exports = {
  search,
};