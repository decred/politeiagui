import compose from "lodash/fp/compose";
import entries from "lodash/fp/entries";
import reduce from "lodash/fp/reduce";
import range from "lodash/range";
import { build, fake } from "test-data-bot";

export const buildUser = build("User").fields({
  email: fake((f) => f.internet.email()),
  username: fake((f) => `user${f.datatype.number()}`),
  password: fake((f) => f.internet.password())
});

export const buildProposal = build("Proposal").fields({
  name: fake((f) => f.lorem.words()),
  description: fake((f) => f.lorem.sentence())
});

export const buildComment = build("Comment").fields({
  text: fake((f) => f.lorem.sentence())
});

export const buildRecord = build("Record").fields({
  token: fake((f) => f.internet.password(15, false, /[0-9a-z]/)),
  timestamp: fake(
    (f) => f.date.between("2021-01-01", "2015-05-01").getTime() / 1000
  ),
  username: fake((f) => `user${f.datatype.number()}`),
  userid: fake((f) => f.datatype.uuid()),
  publickey: fake((f) => f.datatype.hexaDecimal(64, false, /[0-9a-z]/)),
  merkle: fake((f) => f.datatype.hexaDecimal(64, false, /[0-9a-z]/)),
  signature: fake((f) => f.datatype.hexaDecimal(128, false, /[0-9a-z]/))
});

export const fakeToken = () => buildRecord().token;

export const makeCustomInventoryByStatus = (tokenAmountByStatus = {}) =>
  compose(
    reduce(
      (acc, [status, amount]) => ({
        ...acc,
        [status]: range(amount).map(fakeToken)
      }),
      {}
    ),
    entries
  )(tokenAmountByStatus);
