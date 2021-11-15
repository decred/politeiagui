export const API_BASE_URL = "/api/comments/v1";

/**
 * policyReply is the reply to the Policy command. The returned maps are
 * { [rule]: value }, where `rule` is the policy rule.
 *
 * @returns {Object} Policy
 */
export function policyReply() {
  return {
    lengthmax: 8000,
    votechangesmax: 5,
    countpagesize: 10,
    timestampspagesize: 100
  };
}

/**
 * countReply is the reply to the Count command. The returned maps are
 * { [token]: count } where `token` is the Record token and `count` is the
 * comments count.
 *
 * @param {Object} { testParams, requestParams }
 * @returns {Object} count map
 */
export function countReply({
  testParams: { count = 0 },
  requestParams: { tokens = [] }
}) {
  const counts = tokens.reduce(
    (acc, token) => ({ ...acc, [token]: count }),
    {}
  );
  return { counts };
}

export const repliers = {
  policy: policyReply,
  count: countReply
};
