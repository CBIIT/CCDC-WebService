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

utils.consolidateHighlight = (highlights) => {
  //combine highlighted parts together if elements are from the same, such as:
  //"The <b>A</b> B" and "The A <b>B</b" should be combined to be "The <b>A</b> <b>B</b>"
  const result = [];
  const cache = {};
  highlights.forEach((hl) => {
    const rawHl = hl.replace(/<b>/g, "").replace(/<\/b>/g, "");
    const splitedHl = hl.split(" ");
    const marked = splitedHl.map((shl) => {
      const tmp = shl.trim();
      return tmp.startsWith("<b>") && tmp.endsWith("</b>");
    });
    if (!cache[rawHl]) {
      cache[rawHl] = [];
    }
    cache[rawHl].push(marked);
  });
  for (let key in cache) {
    const splitedKey = key.split(" ");
    const highlightedKey = splitedKey.map((sk, idx) => {
      let need2hl = cache[key].reduce((prev, next) => {
        return prev || next[idx];
      }, false);
      return  need2hl ? `<b>${sk}</b>` : sk;
    });
    result.push(highlightedKey.join(" "));
  }
  return result;
};

module.exports = utils;