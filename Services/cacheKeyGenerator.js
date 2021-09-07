let cacheKeyGenerator = {};

cacheKeyGenerator.landingKey = () => {
  return "dr_landing";
};

cacheKeyGenerator.dataresourcesKey = () => {
  return "dr_all";
};

module.exports = cacheKeyGenerator;