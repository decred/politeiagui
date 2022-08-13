import { getTokensArray } from "@politeiagui/core/dev/mocks";
import { getHumanReadableTicketvoteStatus } from "../../lib/utils";

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
