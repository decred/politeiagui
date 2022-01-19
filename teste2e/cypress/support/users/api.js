import pick from "lodash/fp/pick";

import {
  PaymentCredits,
  User,
  userByType,
  Identity,
  USER_TYPE_UNPAID
} from "./generate";
import faker from "faker";

export const API_BASE_URL = "/api/v1/user";
export const API_USERS_BASE_URL = "/api/v1/users";

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
export function meReply({ testParams: { userType, verifyIdentity, user } }) {
  if (!user) {
    user = userByType(userType);
  }
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
  const user = haspaid ? new User() : userByType(USER_TYPE_UNPAID);
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
  const user = haspaid ? new User() : userByType(USER_TYPE_UNPAID);
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

/**
 * usersReply represents the data of /api/v1/users endpoint
 * It currently returns empty data since it is serving the data for downloading
 * and we just check the existence of the downloaded file.
 *
 * @param {Object} { requestParams, testParams }
 * @returns {Object}
 */
function usersReply({
  requestParams: { publickey },
  testParams: { amount = 0 }
}) {
  const users = [];
  for (let i = 0; i < amount; i++) {
    users.push({
      id: faker.datatype.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email()
    });
  }
  return {
    totalmatches: amount,
    totalusers: amount + 10,
    users
  };
}

export const usersRepliers = {
  index: usersReply
};
