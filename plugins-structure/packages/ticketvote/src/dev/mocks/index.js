import { getTokensArray } from "@politeiagui/core/dev/mocks";
import { getHumanReadableTicketvoteStatus } from "../../lib/utils";
import {
  TICKETVOTE_STATUS_APPROVED,
  TICKETVOTE_STATUS_AUTHORIZED,
  TICKETVOTE_STATUS_INELIGIBLE,
  TICKETVOTE_STATUS_REJECTED,
  TICKETVOTE_STATUS_STARTED,
  TICKETVOTE_STATUS_UNAUTHORIZED,
} from "../../lib/constants";
import { faker } from "@faker-js/faker";

const bestblock = 420;

const approvedTicketvoteSummary = {
  type: 1,
  status: TICKETVOTE_STATUS_APPROVED,
  duration: 10,
  startblockheight: bestblock - 20,
  startblockhash:
    "0000000094f39c5495faad40a6554f6996c9912d378afa19b971055ebe505382",
  endblockheight: bestblock - 10,
  eligibletickets: 5589,
  quorumpercentage: 0,
  passpercentage: 60,
  results: [
    { id: "yes", votes: 500 },
    { id: "no", votes: 50 },
  ],
  bestblock,
};

const rejectedTicketvoteSummary = {
  ...approvedTicketvoteSummary,
  status: TICKETVOTE_STATUS_REJECTED,
  results: [
    { id: "yes", votes: 50 },
    { id: "no", votes: 500 },
  ],
};

const emptyTicketvoteSummary = {
  status: 0, // Missing status by default
  type: 0,
  duration: 0,
  startblockheight: 0,
  startblockhash: "",
  endblockheight: 0,
  eligibletickets: 0,
  quorumpercentage: 0,
  passpercentage: 0,
  results: [],
};

export const ticketvoteSummariesByStatus = {
  approved: approvedTicketvoteSummary,
  rejected: rejectedTicketvoteSummary,
  authorized: {
    ...emptyTicketvoteSummary,
    status: TICKETVOTE_STATUS_AUTHORIZED,
  },
  ineligible: {
    ...emptyTicketvoteSummary,
    status: TICKETVOTE_STATUS_INELIGIBLE,
  },
  started: {
    ...approvedTicketvoteSummary,
    endblockheight: bestblock + 10,
    status: TICKETVOTE_STATUS_STARTED,
  },
  unauthorized: {
    ...emptyTicketvoteSummary,
    status: TICKETVOTE_STATUS_UNAUTHORIZED,
  },
};

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
  status, // Missing status by default
  type,
  duration,
  startblockheight,
  startblockhash,
  endblockheight,
  eligibletickets,
  quorumpercentage,
  passpercentage,
  results,
} = emptyTicketvoteSummary) {
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

export function mockTicketvoteDetails() {
  return () => ({
    auths: [JSON.parse(faker.datatype.json())],
    vote: JSON.parse(faker.datatype.json()),
  });
}
