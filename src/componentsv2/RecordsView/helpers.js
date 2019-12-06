/**
 * Filter the records from an array of tokens and object of records by token
 * @param {Array} records
 * @param {Object} recordsTokens
 * @returns {Array} records
 */
export const getRecordsByTabOption = (records, tokens) =>
  tokens.map((token) => records[token]).filter(Boolean);

/**
 * Returns the censorsihp token of a given record
 * @param {Object} record
 * @returns {String} recordToken
 */
export const getRecordToken = (record) =>
  record && record.censorshiprecord && record.censorshiprecord.token;
