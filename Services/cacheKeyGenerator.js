let cacheKeyGenerator = {};

cacheKeyGenerator.landingKey = () => {
  return "dr_landing";
};

cacheKeyGenerator.dataresourcesKey = () => {
  return "dr_all";
};

cacheKeyGenerator.datasetsCountKey = () => {
  return "ds_counts";
};

cacheKeyGenerator.filtersKey = () => {
  return "ds_filters";
};

cacheKeyGenerator.participatingResourcesFiltersKey = () => {
  return "dr_filters";
};

cacheKeyGenerator.advancedFiltersKey = () => {
  return "ds_advanced_filters";
};

cacheKeyGenerator.datasetKey = (id) => {
  return `ds_item_${id}`;
};

cacheKeyGenerator.dataresourceKey = (id) => {
  return `dr_item_${id}`;
};

module.exports = cacheKeyGenerator;