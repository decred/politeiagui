/**
 * Converts an array of chars into a Regex Expression
 * @param {Array} supportedChars
 * @return {RegExp} regex expression from supported chars
 */
export function buildRegexFromSupportedChars(supportedChars) {
  const charNeedsEscaping = (c) => c === "/" || c === "." || c === "-";
  const concatedChars = supportedChars.reduce(
    (str, char) => (charNeedsEscaping(char) ? str + `\\${char}` : str + char),
    ""
  );
  const regex = "^[" + concatedChars + "]*$";
  return new RegExp(regex);
}
