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

export { buildUser, buildProposal, buildComment };
