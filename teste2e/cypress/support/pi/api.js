import { chunkByStatusAmount } from "../core/utils";
import { Summary } from "./generate";

export const API_BASE_URL = "/api/pi/v1";

/**
 * summariesReply is the reply to the Summaries command. The returned maps are
 * { [token]: Summary }, where Summary is the pi generated summary
 *
 * @param {Object} { testParams, requestParams }
 * @returns {Object} summaries map
 */
export function summariesReply({
  testParams: { amountByStatus = {} },
  requestParams: { tokens = [] }
}) {
  const tokensByStatus = chunkByStatusAmount(tokens, amountByStatus);
  const summaries = Object.entries(tokensByStatus).reduce(
    (acc, [status, tokens]) => ({
      ...acc,
      ...tokens.reduce(
        (sum, token) => ({
          ...sum,
          [token]: new Summary({ status })
        }),
        {}
      )
    }),
    {}
  );
  return { summaries };
}

/**
 * policyReply is the reply to the Policy command. The returned maps are
 * { [rule]: value }, where `rule` is the policy rule.
 *
 * @returns {Object} Policy
 */
export function policyReply() {
  return {
    textfilesizemax: 524288,
    imagefilecountmax: 5,
    imagefilesizemax: 524288,
    namelengthmin: 8,
    namelengthmax: 80,
    namesupportedchars: [
      "A-z",
      "0-9",
      "&",
      ".",
      ",",
      ":",
      ";",
      "-",
      " ",
      "@",
      "+",
      "#",
      "/",
      "(",
      ")",
      "!",
      "?",
      String.fromCharCode(34),
      "'"
    ],
    amountmin: 100,
    amountmax: 100000000,
    startdatemin: 604800,
    enddatemax: 31557600,
    domains: ["development", "marketing", "research", "design"],
    summariespagesize: 5,
    billingstatuschangespagesize: 5,
    billingstatuschangesmax: 1
  };
}

export const repliers = {
  summaries: summariesReply,
  policy: policyReply
};
