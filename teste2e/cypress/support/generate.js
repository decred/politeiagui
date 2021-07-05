import compose from "lodash/fp/compose";
import entries from "lodash/fp/entries";
import reduce from "lodash/fp/reduce";
import range from "lodash/range";
import { build, fake } from "test-data-bot";

const buildUser = build("User").fields({
  email: fake((f) => f.internet.email()),
  username: fake((f) => `user${f.random.number()}`),
  password: fake((f) => f.internet.password())
});

const buildProposal = build("Proposal").fields({
  name: fake((f) => f.lorem.words()),
  description: fake((f) => f.lorem.sentence())
});

const buildComment = build("Comment").fields({
  text: fake((f) => f.lorem.sentence())
});

const buildRecordToken = build("RecordToken").fields({
  token: fake((f) => f.internet.password(15, false, /[0-9a-z]/))
});

const fakeToken = () => buildRecordToken().token;

const makeCustomInventoryByStatus = (tokenAmountByStatus = {}) =>
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

export { buildUser, buildProposal, buildComment, makeCustomInventoryByStatus };
