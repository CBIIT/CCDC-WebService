const config = require("../Config");
const cache = require("../Components/cache");
const cacheKeyGenerator = require("./cacheKeyGenerator");
const mysql = require("../Components/mysql");

const getSiteDataUpdate = async () => {
  let siteUpdateDateKey = cacheKeyGenerator.siteUpdateDateKey();
  let date = cache.getValue(siteUpdateDateKey);
  if(!date){
    let sql = "select data_element, element_value, dataset_count from aggragation where data_element=?";

    let inserts = [
      "Site Data Update"
    ];
    sql = mysql.format(sql, inserts);
    const result = await mysql.query(sql);
    //group by data
    if(result.length > 0){
      date = result[0].element_value;
      cache.setValue(siteUpdateDateKey, date, config.itemTTL);
    }
  }

  return date;
};

const getWidgetUpdate = async () => {
  let widgetUpdateKey = cacheKeyGenerator.widgetUpdateKey();
  let result = cache.getValue(widgetUpdateKey);
  if(!result) {
    let sql = "select id, log_type, title, post_date, description from changelog order by post_date desc limit 3";

    let inserts = [];
    sql = mysql.format(sql, inserts);
    const result = await mysql.query(sql);
    if(result.length > 0){
      cache.setValue(widgetUpdateKey, result, config.itemTTL);
    }
  }
  return result;
};

const getSiteUpdate = async (pageInfo) => {
    let sql = "select id, log_type, title, post_date, description from changelog where log_type = 1 order by post_date desc limit ?, ?";

    let inserts = [
      ( pageInfo.page - 1 ) * pageInfo.pageSize,
      pageInfo.pageSize
    ];
    sql = mysql.format(sql, inserts);
    const result = await mysql.query(sql);
    return result;
};

module.exports = {
  getSiteDataUpdate,
  getWidgetUpdate,
  getSiteUpdate,
};