import * as stringUtils from "./strings";

/**
 * Converts an array of chars into a Regex Expression
 * @param {Array} supportedChars
 * @return {RegExp} regex expression from supported chars
 */
export const buildRegexFromSupportedChars = (supportedChars) => {
  const charNeedsEscaping = (c) => c === "/" || c === "." || c === "-";
  const concatedChars = supportedChars.reduce(
    (str, char) => (charNeedsEscaping(char) ? str + `\\${char}` : str + char),
    ""
  );
  const regex = "^[" + concatedChars + "]*$";
  return new RegExp(regex);
};

/**
 * Converts an array of chars into a Regex Expression
 * @param {Array} supportedChars
 * @return {RegExp} Simple regex expression from supported chars
 */
export const buildSimpleMatchRegexFromSupportedChars = (supportedChars) => {
  const charNeedsEscaping = (c) => c === "/" || c === "." || c === "-";
  const concatedChars = supportedChars.reduce(
    (str, char) => (charNeedsEscaping(char) ? str + `\\${char}` : str + char),
    ""
  );
  const regex = "([" + concatedChars + "])";
  return new RegExp(regex, "gi");
};

/**
 * Creates a string from the concatenation of the supported chars
 * @param {Array} supportedChars
 * @returns {string} string of valid chars
 */
export const buildValidCharsStrFromSupportedChars = (supportedChars) =>
  supportedChars.reduce((str, v) => str + v, "");

/**
 * @param {string} fieldName
 * @param {Array} supportedChars
 * @returns {string} custom error message for a non-valid field given a set of
 * supported chars
 */
export const invalidMessage = (fieldName, supportedChars) =>
  `${stringUtils.capitalize(
    fieldName
  )} is not valid. Valid chars are ${buildValidCharsStrFromSupportedChars(
    supportedChars
  )} `;

/**
 * Creates a yup field matcher for given a field name and an array of
 * supported chars
 * @param {string} fieldName
 * @param {Array} supportedChars
 * @returns {Array} array of parameters for a yup field matcher
 */
export const yupFieldMatcher = (fieldName, supportedChars) => {
  return [
    buildRegexFromSupportedChars(supportedChars),
    {
      excludeEmptyString: true,
      message: invalidMessage(fieldName, supportedChars)
    }
  ];
};

/**
 * Returns a generic error message for exceeding the minimum length
 * @param {string} fieldName
 * @param {number} minLenght
 */
export const minLengthMessage = (fieldName, minLenght) =>
  `${stringUtils.capitalize(
    fieldName
  )} must be at least ${minLenght} characters`;

/**
 * Returns a generic error message for exceeding the exact length
 * @param {string} fieldName
 * @param {number} length
 */
export const exactLengthMessage = (fieldName, length) =>
  `${stringUtils.capitalize(fieldName)} must be exactly ${length} characters`;

/**
 * Returns a generic error message for exceeding the maximum length
 * @param {string} fieldName
 * @param {number} maxLength
 */
export const maxLengthMessage = (fieldName, maxLength) =>
  `${stringUtils.capitalize(
    fieldName
  )} must be at most ${maxLength} characters`;

/**
 * Returns a generic error message for exceeding the maximum amount
 * for a given field name
 */
export const minAmountMessage = (fieldName, minAmount) =>
  `${stringUtils.capitalize(
    fieldName
  )} must be greater than or equal to ${minAmount}`;

/**
 * Returns a generic error message for not meeting the minimun amount
 * for a given field name
 */
export const maxAmountMessage = (fieldName, maxAmount) =>
  `${stringUtils.capitalize(
    fieldName
  )} must be less than or equal to ${maxAmount}`;

/**
 * Returns a generic error message for exceeding the maximum size
 * for attached files in a proposal
 */
export const maxFileSizeMessage = () => "Files size can be at most 512kb";

/**
 * Returns a generic error message for exceeding the maximum number
 * of attached files in a proposal
 */
export const maxFilesExceededMessage = (max) =>
  `Proposals must have at most ${max} attached images`;

/**
 * Returns a generic error message for invalid mime types on
 * attached files
 * @param {Array} validMimeTypes
 */
export const validMimeTypesMessage = (validMimeTypes) =>
  `Files must have a valid mime type: ${validMimeTypes}`;
