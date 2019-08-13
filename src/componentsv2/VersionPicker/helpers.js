/**
 * Creates a select option from a string sort option.
 * @param {String} version
 * @returns {Object} selectOption
 */
export const getSelectOptionFromVersion = version => ({
  label: `Version ${version}`,
  value: version
});
