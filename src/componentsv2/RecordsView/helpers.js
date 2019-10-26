/**
 * Filter the records from an array of tokens and object of records by token
 * @param {Array} records
 * @param {Object} recordsTokens
 * @returns {Array} records
 */
export const getRecordsByTabOption = (records, tokens) =>
  tokens.map(token => records[token]).filter(Boolean);
