const pjson = require('../package.json');

let utils = {};

utils.getSearchableText = (searchText) => {
  const strArr = searchText.trim().split(" ");
  const result = [];
  strArr.forEach((term) => {
    const t = term.trim();
    if (t.length > 2) {
      result.push(t);
    }
  });
  return result.length === 0 ? "" : result.join(" ");
};

utils.getRandom = (arr, n) => {
  let result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
      let x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

utils.getVersion = () => {
  return pjson.version;
};

module.exports = utils;