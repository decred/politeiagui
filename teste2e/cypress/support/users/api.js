import pick from "lodash/fp/pick";

import { PaymentCredits, User, userByType } from "./generate";

export const API_BASE_URL = "/api/v1/user";

export function loginReply({
  testParams: { userType, ...props },
  requestParams: { email }
}) {
  return userByType(userType, { ...props, email });
}

export function meReply({ testParams: { userType } }) {
  return userByType(userType);
}

export function paymentsRegistrationReply({ testParams: { haspaid = true } }) {
  const user = haspaid ? new User() : userByType("unpaid");
  const userRegistrationPayment = pick([
    "paywalladdress",
    "paywallamount",
    "paywalltxnotbefore"
  ])(user);
  return { haspaid, ...userRegistrationPayment };
}

export function paymentsPaywallReply({
  testParams: { haspaid = true, creditprice = 10000000 }
}) {
  const user = haspaid ? new User() : userByType("unpaid");
  const userPaywallPayment = pick(["paywalltxnotbefore", "paywalladdress"])(
    user
  );
  return { creditprice, ...userPaywallPayment };
}

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
