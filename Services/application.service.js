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

module.exports = {
  getSiteDataUpdate,
};