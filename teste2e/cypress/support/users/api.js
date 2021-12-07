import pick from "lodash/fp/pick";

import { PaymentCredits, User, userByType, Identity } from "./generate";

export const API_BASE_URL = "/api/v1/user";

/**
 * loginReply is the replier to the Login command.
 *
 * @param {Object} { testParams, requestParams }
 * @returns User
 */
export function loginReply({
  testParams: { userType, verifyIdentity, ...userProps },
  requestParams: { email }
}) {
  const user = userByType(userType, { ...userProps, email });
  if (verifyIdentity) {
    const { userid, publickey } = user;
    Identity({ userid, publickey });
  }
  return user;
}

/**
 * meReply is the replier to the Me command.
 *
 * @param {Object} { testParams }
 * @returns User
 */
export function meReply({ testParams: { userType, verifyIdentity } }) {
  const user = userByType(userType);
  if (verifyIdentity) {
    const { userid, publickey } = user;
    Identity({ userid, publickey });
  }
  return user;
}

/**
 * paymentsRegistrationReply is the replier to the PaymentsRegistration command.
 *
 * @param {Object} { testParams }
 * @returns Payment registration object
 */
export function paymentsRegistrationReply({ testParams: { haspaid = true } }) {
  const user = haspaid ? new User() : userByType("unpaid");
  const userRegistrationPayment = pick([
    "paywalladdress",
    "paywallamount",
    "paywalltxnotbefore"
  ])(user);
  return { haspaid, ...userRegistrationPayment };
}

/**
 * paymentsPaywallReply is the replier to the PaymentsPaywall command.
 *
 * @param {Object} { testParams }
 * @returns Payment paywall object
 */
export function paymentsPaywallReply({
  testParams: { haspaid = true, creditprice = 10000000 }
}) {
  const user = haspaid ? new User() : userByType("unpaid");
  const userPaywallPayment = pick(["paywalltxnotbefore", "paywalladdress"])(
    user
  );
  return { creditprice, ...userPaywallPayment };
}

/**
 * paymentsCreditsReply is the replier for the PaymentsCredits command.
 *
 * @param {Object} { testParams }
 * @returns Payment credits object
 */
export function paymentsCreditsReply({
  testParams: { spent = 0, credits = 100 }
}) {
  return new PaymentCredits({ spent, unspent: credits });
}

export const repliers = {
  login: loginReply,
  me: meReply,
  "payments/registration": paymentsRegistrationReply,
  "payments/paywall": paymentsPaywallReply,
  "payments/credits": paymentsCreditsReply
};
