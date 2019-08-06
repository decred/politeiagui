/**
 * Filter the records based on a given tab option and an object of records
 * tokens
 * @param {string} tabOption
 * @param {Array} records
 * @param {Object} recordsTokens
 * @returns {Array} records
 */
export const getRecordsByTabOption = (tabOption, records, tokens) => {
  const filterRecordsByTokens = (tokens, records) =>
    tokens.reduce((filteredRecords, token) => {
      const foundProp = records.find(
        prop =>
          prop && prop.censorshiprecord && token === prop.censorshiprecord.token
      );
      return foundProp ? filteredRecords.concat([foundProp]) : filteredRecords;
    }, []);

  return filterRecordsByTokens(tokens, records);
};
