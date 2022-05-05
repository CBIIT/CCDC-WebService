const config = require("../Config");
const elasticsearch = require("../Components/elasticsearch");
const cache = require("../Components/cache");
const mysql = require("../Components/mysql");
const queryGenerator = require("./queryGenerator");
const cacheKeyGenerator = require("./cacheKeyGenerator");
const dataresourceService = require("./dataresource.service");
const utils = require("../Utils");

const search = async (searchText, filters, options) => {
  let result = {};
  let searchableText = utils.getSearchableText(searchText);
  if (searchableText !== "") {
    let aggregationKey = cacheKeyGenerator.getAggregationKey(searchableText);
    let aggregation = cache.getValue(aggregationKey);
    if(!aggregation){
      let query = queryGenerator.getSearchAggregationQuery(searchText);
      let searchResults = await elasticsearch.searchWithAggregations(config.indexDS, query);
      aggregation = searchResults.aggs.myAgg.buckets;
      //put in cache for 5 mins
      cache.setValue(aggregationKey, aggregation, config.itemTTL/288);
    }
    const aggs = aggregation.map((agg) => agg.key);
    result.aggs = aggs.join("|");
  } else {
    result.aggs = "all";
  }
  
  let query = queryGenerator.getSearchQueryV2(searchText, filters, options);
  let searchResults = await elasticsearch.searchWithAggregations(config.indexDS, query);
  let datasets = searchResults.hits.hits.map((ds) => {
    return {content: ds._source, highlight: ds.highlight};
  });
  result.total = searchResults.hits.total.value;
  result.data = datasets;
  return result;
};

const export2CSV = async (searchText, options) => {
  let query = queryGenerator.getSearchQueryV2(searchText, options);
  let searchResults = await elasticsearch.search(config.indexDS, query);
  let dataElements = ["case_disease_diagnosis", "case_age_at_diagnosis",
   "case_ethnicity", "case_race", "case_sex", "case_tumor_site",
    "case_treatment_administered", "case_treatment_outcome", "sample_assay_method", "sample_analyte_type"];
  let datasets = searchResults.hits.map((ds) => {
    let tmp = ds._source;
    dataElements.forEach((de) => {
      if(tmp[de]) {
        tmp[de] = tmp[de].map((t) => {
          return t.n + " (" + t.v + ")";
        });
      }
    });
    if(tmp.additional) {
      tmp.additional = tmp.additional.map((t) => {
        let sets = [];
        t.attr_set.forEach((as) => {
          sets.push(as.k);
        });
        return t.attr_name + " (" + sets.join() + ")";
      });
    }
    if(tmp.projects) {
      if (!tmp.additional) {
        tmp.additional = [];
      }
      const ps = tmp.projects.map((p) => {
        let sets = [];
        p.p_v.forEach((pv) => {
          sets.push(pv.k + " (" + pv.v + ")");
        });
        return p.p_k + ": " + sets.join();
      });
      tmp.additional.push("Projects {" + ps.join() + "}");
    }
    return ds._source;
  });
  return datasets;
};

const searchById = async (id) => {
  let datasetKey = cacheKeyGenerator.datasetKey(id);
  let dataset = cache.getValue(datasetKey);
  if(!dataset){
    let query = queryGenerator.getDatasetByIdQuery(id);
    let searchResults = await elasticsearch.search(config.indexDS, query);
    let datasets = searchResults.hits.map((ds) => {
      return ds._source;
    });
    dataset = datasets[0];
    cache.setValue(datasetKey, dataset, config.itemTTL);
  }
  return dataset;
};

const getFilters = async () => {
  let filtersKey = cacheKeyGenerator.filtersKey();
  let filters = cache.getValue(filtersKey);
  if(!filters){
    //querying elasticsearch, save to dataresources cache
    //let sql = "select lt.term_name as name, lvs.permissible_value as value from lu_terms lt, lu_value_set lvs where lt.id = lvs.term_id and lt.term_name in (?,?,?,?,?,?,?,?,?,?,?,?)";
    let sql = "select data_element, element_value, dataset_count from aggragation where data_element in (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    let inserts = [
      "Case Disease Diagnosis",
      "Case Tumor Site",
      "Case Treatment Administered",
      "Sample Assay Method",
      "Sample Analyte Type",
      "Sample Composition Type",
      "Case Age at Diagnosis",
      "Case Ethnicity",
      "Case Race",
      "Case Sex",
      "Research Data Repository",
      "Program",
      "Catalog",
      "Registry"
    ];
    sql = mysql.format(sql, inserts);
    const result = await mysql.query(sql);
    //group by data
    filters = {};
    let dsAll = await dataresourceService.getAll();
    let dsDictionary = {};
    dsAll.forEach((ds) => {
      dsDictionary[ds.data_resource_id] = ds;
    });
    if(result.length > 0){
      result.map((kv) => {
        if(!filters[kv.data_element]){
          filters[kv.data_element] = [];
        }
        if(["Research Data Repository","Program", "Catalog", "Registry"].indexOf(kv.data_element) > -1){
          filters[kv.data_element].push({name: kv.element_value, label: dsDictionary[kv.element_value].resource_name,  count: kv.dataset_count});
        } else{
          filters[kv.data_element].push({name: kv.element_value, count: kv.dataset_count});
        }
      });
      //sort and top n
      for(let k in filters){
        const tmp = filters[k];
        tmp.sort((firstEL, secondEL) => {
          //return secondEL.count > firstEL.count ? 1 : -1;
          return secondEL.name < firstEL.name ? 1 : -1;
        });
        filters[k] = tmp.length > config.limitFilterCount ? tmp.slice(0, config.limitFilterCount) : tmp;
      }
      cache.setValue(filtersKey, filters, config.itemTTL);
    }
  }

  return filters;
};

const getAdvancedFilters = async () => {
  let advancedFiltersKey = cacheKeyGenerator.advancedFiltersKey();
  let advancedFilters = cache.getValue(advancedFiltersKey);
  if(!advancedFilters){
    //querying elasticsearch, save to dataresources cache
    //let sql = "select lt.term_name as name, lvs.permissible_value as value from lu_terms lt, lu_value_set lvs where lt.id = lvs.term_id and lt.term_name in (?,?,?,?,?,?,?,?,?,?,?,?)";
    let sql = "select data_element, element_value, dataset_count from aggragation where data_element in (?,?,?,?,?,?,?,?,?,?,?,?,?)";

    let inserts = [
      "Case Disease Diagnosis",
      "Case Tumor Site",
      "Case Treatment Administered",
      "Case Treatment Outcome",
      "Sample Anatomic Site",
      "Sample Assay Method",
      "Sample Analyte Type",
      "Sample Composition Type",
      "Sample Is Normal",
      "Case Age at Diagnosis",
      "Case Ethnicity",
      "Case Race",
      "Case Sex"
    ];
    sql = mysql.format(sql, inserts);
    const result = await mysql.query(sql);
    //group by data
    advancedFilters = {};
    if(result.length > 0){
      result.map((kv) => {
        if(!advancedFilters[kv.data_element]){
          advancedFilters[kv.data_element] = [];
        }
        advancedFilters[kv.data_element].push(kv.element_value);
      });
      //add case count
      advancedFilters["Number of Cases"] = [
        "0 - 10 Cases",
        "10 - 100 Cases",
        "100 - 1000 Cases",
        "> 1000 Cases",
      ];
      //add sample count
      advancedFilters["Number of Samples"] = [
        "0 - 10 Samples",
        "10 - 100 Samples",
        "100 - 1000 Samples",
        "> 1000 Samples",
      ];
      //sort and top n
      for(let k in advancedFilters){
        const tmp = advancedFilters[k];
        tmp.sort();
        //advancedFilters[k] = tmp.length > config.limitAdvancedFilterCount ? tmp.slice(0, config.limitAdvancedFilterCount) : tmp;
        advancedFilters[k] = tmp;
      }
      cache.setValue(advancedFiltersKey, advancedFilters, config.itemTTL);
    }
  }

  return advancedFilters;
};

const searchDatasetsByDataresourceId = async (dataresourceId) => {
  let query = queryGenerator.getDatasetsByDataresourceIdQuery(dataresourceId);
  let searchResults = await elasticsearch.search(config.indexDS, query);
  let datasets = searchResults.hits.map((ds) => {
    return ds._source;
  });
  return datasets;
}

module.exports = {
    search,
    export2CSV,
    searchById,
    getFilters,
    getAdvancedFilters,
    searchDatasetsByDataresourceId,
};