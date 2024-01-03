const config = require("../Config");
const cache = require("../Components/cache");
const cacheKeyGenerator = require("./cacheKeyGenerator");
const mysql = require("../Components/mysql");

const getSiteDataUpdate = async () => {
  let siteUpdateDateKey = cacheKeyGenerator.siteUpdateDateKey();
  let date = cache.getValue(siteUpdateDateKey);
  if (!date) {
    let sql = "select data_element, element_value, dataset_count from aggragation where data_element=?";

    let inserts = [
      "Site Data Update"
    ];
    sql = mysql.format(sql, inserts);
    const result = await mysql.query(sql);
    //group by data
    if (result.length > 0) {
      date = result[0].element_value;
      cache.setValue(siteUpdateDateKey, date, config.itemTTL);
    }
  }

  return date;
};

const getWidgetUpdate = async () => {
  let widgetUpdateKey = cacheKeyGenerator.widgetUpdateKey();
  let result = cache.getValue(widgetUpdateKey);
  if (!result) {
    let sql = "select id, log_type, title, post_date, content_type, description from changelog order by post_date desc limit 3";

    let inserts = [];
    sql = mysql.format(sql, inserts);
    result = await mysql.query(sql);
    if (result.length > 0) {
      cache.setValue(widgetUpdateKey, result, config.itemTTL);
    }
  }
  return result;
};

const getSiteUpdate = async (pageInfo) => {
  let sql = "select id, post_date, content_type, title, description as highlight, details as description from changelog where log_type = 1 order by post_date desc limit ?, ?";

  let inserts = [
    ( pageInfo.page - 1 ) * pageInfo.pageSize,
    pageInfo.pageSize
  ];
  sql = mysql.format(sql, inserts);
  const result = await mysql.query(sql);
  return result;
};

/**
 * Retrieves glossary terms by specified glossary term names
 * @param {string[]} termNames Array of names of glossary terms to search for
 * @returns {object} Map of glossary term names to glossary terms
 */
const getGlossaryTerms = async (termNames) => {
  let inserts = [];
  let results = [];
  let sql = '';
  let terms = {};

  // Special case for returning all terms if no names specified
  if (termNames.length === 0) {
    sql = 'SELECT * FROM glossary ORDER BY term_name';
  } else {
    inserts = [...inserts, [termNames]];
    sql = 'SELECT * FROM glossary WHERE term_name IN ? ORDER BY term_name';
  }

  sql = mysql.format(sql, inserts);
  results = await mysql.query(sql);

  results.forEach((term) => {
    terms[term.term_name] = term.definition;
  });

  return terms;
};

/**
 * Retrieves glossary terms whose names start with the specified letter
 * @param {string} firstLetter The letter that the term names should start with
 * @returns {object[]} Array of glossary terms
 */
const getGlossaryTermsByFirstLetter = async (firstLetter) => {
  let terms = {};
  let sql = '';

  if (!firstLetter || firstLetter.length > 1) {
    throw new Error('Argument should be exactly one character long.');
  }

  sql = `
    SELECT
      term_name AS \`name\`,
      term_category AS category,
      \`definition\`,
      \`reference\`
    FROM glossary
    WHERE term_name LIKE '${firstLetter}%'
    ORDER BY term_name;`;
  termList = await mysql.query(sql);
  terms[firstLetter] = termList;
  return terms;
};

/**
 * Retrieves a list of all letters that glossary terms start with
 * @returns {string[]} List of letters
 */
const getFirstLettersInGlossary = async () => {
  let glossaryLettersKey = cacheKeyGenerator.glossaryLettersKey();
  let letters = cache.getValue(glossaryLettersKey);
  const alphabet = [
    'A', 'B', 'C', 'D', 'E',
    'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y',
    'Z',
  ];
  const sql = `
    SELECT UPPER(LEFT(term_name, 1)) AS letter
    FROM ccdc.glossary
    GROUP BY letter;
  `;

  if (!letters) {
    let results = await mysql.query(sql);
    results = results.map((result) => result.letter);
    letters = {};

    alphabet.forEach((letter) => {
      if (results.includes(letter)) {
        letters[letter] = true;
      } else {
        letters[letter] = false;
      }
    });

    if (letters.length > 0) {
      cache.setValue(glossaryLettersKey, letters, config.itemTTL);
    }
  }

  return letters;
};

module.exports = {
  getFirstLettersInGlossary,
  getGlossaryTerms,
  getGlossaryTermsByFirstLetter,
  getSiteDataUpdate,
  getSiteUpdate,
  getWidgetUpdate,
};
