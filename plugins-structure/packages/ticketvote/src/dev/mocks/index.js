import { getTokensArray } from "@politeiagui/core/dev/mocks";
import { getHumanReadableTicketvoteStatus } from "../../lib/utils";
import { faker } from "@faker-js/faker";

const bestblock = 420;

export function mockTicketvoteInventory(amount, customTokens = []) {
  const amountToGenerate = amount - customTokens.length;
  return ({ status }) => ({
    bestblock,
    vetted: {
      [getHumanReadableTicketvoteStatus(status)]: [
        ...customTokens,
        ...getTokensArray(amountToGenerate),
      ],
    },
  });
}

export function mockTicketvotePolicy({
  linkbyperiodmin = 1,
  linkbyperiodmax = 7776000,
  votedurationmin = 1,
  votedurationmax = 4032,
  summariespagesize = 5,
  inventorypagesize = 20,
  timestampspagesize = 100,
} = {}) {
  return () => ({
    linkbyperiodmin,
    linkbyperiodmax,
    votedurationmin,
    votedurationmax,
    summariespagesize,
    inventorypagesize,
    timestampspagesize,
  });
}

export function mockTicketvoteSubmissions(amount = 1) {
  return () => ({
    submissions: getTokensArray(amount),
  });
}

export function mockTicketvoteSummaries({
  status = 0, // Missing status by default
  type = 0,
  duration = 0,
  startblockheight = 0,
  startblockhash = "",
  endblockheight = 0,
  eligibletickets = 0,
  quorumpercentage = 0,
  passpercentage = 0,
  results = [],
} = {}) {
  return ({ tokens }) => {
    const summaries = tokens.reduce(
      (response, token) => ({
        ...response,
        [token]: {
          type,
          status,
          duration,
          startblockheight,
          startblockhash,
          endblockheight,
          eligibletickets,
          quorumpercentage,
          passpercentage,
          results,
          bestblock,
        },
      }),
      {}
    );
    return { summaries };
  };
}

export function mockTicketvoteTimestamps({ votesCount = 100 } = {}) {
  return ({ votespage }) => {
    function getTimestampData() {
      return {
        data: faker.datatype.json(),
        digest: faker.datatype.hexadecimal(64),
        txid: faker.datatype.hexadecimal(64),
        merkleroot: faker.datatype.hexadecimal(64),
        proofs: [],
      };
    }
    if (!votespage) {
      return { auths: [getTimestampData()], details: getTimestampData() };
    }
    return { votes: Array(votesCount).fill({}).map(getTimestampData) };
  };
}

export function mockTicketvoteResults({ yes = 10, no = 10, result = {} } = {}) {
  return ({ token }) => {
    const voteData = {
      token,
      ticket: faker.random.numeric(64),
      address: faker.random.numeric(35),
      signature: "",
      receipt: "",
      timestamp: Date.now() / 1000,
    };
    const yesVotes = Array(yes).fill({
      ...voteData,
      ...result,
      votebit: "2",
    });
    const noVotes = Array(no).fill({
      ...voteData,
      ...result,
      votebit: "1",
    });
    return { votes: [...yesVotes, ...noVotes] };
  };
}
