import compose from "lodash/fp/compose";
import get from "lodash/fp/get";
import entries from "lodash/fp/entries";
import reduce from "lodash/fp/reduce";
import range from "lodash/fp/range";
import map from "lodash/fp/map";
import chunk from "lodash/fp/chunk";
import times from "lodash/fp/times";
import { build, fake } from "test-data-bot";

export const buildUser = build("User").fields({
  email: fake((f) => f.internet.email()),
  username: fake((f) => `user${f.datatype.number()}`),
  password: fake((f) => f.internet.password())
});

export const buildUserSession = build("User").fields({
  isadmin: false,
  userid: fake((f) => f.datatype.uuid()),
  email: fake((f) => f.internet.email()),
  username: fake((f) => f.internet.userName()),
  publickey: fake((f) => f.datatype.hexaDecimal(64, false, /[0-9a-z]/)),
  paywalladdress: fake(
    (f) => `Ts${f.datatype.hexaDecimal(33, false, /[0-9a-z]/)}`
  ),
  paywallamount: 10000000,
  paywalltxnotbefore: Date.now() / 1000 - 3600,
  paywalltxid: fake((f) => f.datatype.hexaDecimal(64, false, /[0-9a-z]/)),
  proposalcredits: fake((f) => f.datatype.number()),
  lastlogintime: Date.now() / 1000,
  sessionmaxage: 86400,
  totpverified: false
});

export const buildProposal = build("Proposal").fields({
  name: fake((f) => f.lorem.words()),
  description: fake((f) => f.lorem.sentence()),
  // two weeks from now
  startDate: Math.round(new Date().getTime() / 1000) + 1209600,
  // one month from now
  endDate: Math.round(new Date().getTime() / 1000) + 2629746,
  amount: 2000000, // $20k in cents.
  domain: "research"
});

export const buildComment = build("Comment").fields({
  text: fake((f) => f.lorem.sentence())
});

export const buildAuthorUpdate = build("AuthorUpdate").fields({
  title: fake((f) => f.lorem.words()),
  text: fake((f) => f.lorem.sentence())
});

export const buildRecord = build("Record").fields({
  token: fake((f) => f.internet.password(15, false, /[0-9a-z]/)),
  timestamp: Date.now() / 1000,
  username: fake((f) => `user${f.datatype.number()}`),
  userid: fake((f) => f.datatype.uuid()),
  publickey: fake((f) => f.datatype.hexaDecimal(64, false, /[0-9a-z]/)),
  merkle: fake((f) => f.datatype.hexaDecimal(64, false, /[0-9a-z]/)),
  signature: fake((f) => f.datatype.hexaDecimal(128, false, /[0-9a-z]/))
});

export const buildRecordComment = ({
  token,
  state = 2,
  downvotes = 0,
  upvotes = 0,
  commentid
}) =>
  build("RecordComment").fields({
    userid: fake((f) => f.datatype.uuid()),
    username: fake((f) => `user${f.datatype.number()}`),
    state,
    token,
    parentid: 0,
    comment: fake((f) => f.lorem.sentence()),
    publickey: fake((f) => f.datatype.hexaDecimal(64, false, /[0-9a-z]/)),
    signature: fake((f) => f.datatype.hexaDecimal(128, false, /[0-9a-z]/)),
    commentid: commentid || fake((f) => f.datatype.number()),
    timestamp: Date.now() / 1000,
    receipt: fake((f) => f.datatype.hexaDecimal(128, false, /[0-9a-z]/)),
    downvotes,
    upvotes
  })();

export const buildPaymentRegistration = build("PaymentRegistration").fields({
  paywalladdress: fake(
    (f) => `Ts${f.datatype.hexaDecimal(33, false, /[0-9a-z]/)}`
  ),
  haspaid: true,
  paywallamount: 1,
  paywalltxnotbefore: Date.now() / 1000 - 3600
});

export const buildPaymentPaywall = build("PaymentPaywall").fields({
  paywalltxnotbefore: Date.now() / 1000 - 3600,
  paywalladdress: fake(
    (f) => `Ts${f.datatype.hexaDecimal(33, false, /[0-9a-z]/)}`
  ),
  creditprice: 10000000
});

export const buildPaymentCredits = (spent, unspent) => {
  const makeCredits = compose(
    map(() => ({
      paywallid: 0,
      price: 0,
      datepurchased: Date.now() / 1000,
      txid: "created_by_dbutil"
    })),
    times
  );
  return build("PaymentCredits").fields({
    spentcredits: makeCredits(spent),
    unspentcredits: makeCredits(unspent)
  })();
};

const fakeToken = () => buildRecord().token;

/**
 * makeCustomInventoryByStatus returns a custom random token inventory by given
 * { [status]: amount } defined by tokensAmountByStatus.
 *
 * @param {Object} tokensAmountByStatus
 * @param {Number} pageLimit
 */
export function makeCustomInventoryByStatus(
  tokensAmountByStatus = {},
  pageLimit = 20
) {
  return compose(
    reduce(
      (acc, [status, amount]) => ({
        ...acc,
        [status]: compose(chunk(pageLimit), map(fakeToken), range(amount))(0)
      }),
      {}
    ),
    entries
  )(tokensAmountByStatus);
}

/**
 * makeCustomUserSession returns some custom user credentials
 * for given user type
 * @param {String} userType admin, paid, unpaid, totpActive, noCredits
 */
export function makeCustomUserSession(userType = "paid") {
  const user = buildUserSession();
  return get(userType)({
    admin: { ...user, isadmin: true },
    unpaid: {
      ...user,
      paywallamount: 0,
      paywalladdress: "",
      paywalltxid: ""
    },
    paid: user,
    totpActive: {
      ...user,
      totpverified: true
    },
    noCredits: {
      ...user,
      proposalcredits: 0
    }
  });
}
