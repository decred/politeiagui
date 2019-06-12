/**
 * Capitalizes the first letter of a given string
 * @param {string} stringInput
 * @returns {string} stringOutput
 */
export const capitalize = stringInput => {
  if (typeof stringInput !== "string") return "";
  return stringInput.charAt(0).toUpperCase() + stringInput.slice(1);
};
