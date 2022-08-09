import { piSummaries } from "./";
import { getTokensToFetch } from "@politeiagui/core/records/utils";
import isEmpty from "lodash/isEmpty";

export async function fetchSingleRecordPiSummaries(state, dispatch, { token }) {
  const hasPiSummaries = piSummaries.selectByToken(state, token);
  if (!hasPiSummaries) await dispatch(piSummaries.fetch({ tokens: [token] }));
}

export async function fetchRecordsPiSummaries(
  state,
  dispatch,
  { inventoryList }
) {
  const {
    piSummaries: { byToken },
    piPolicy: {
      policy: { summariespagesize },
    },
  } = state;
  const piSummariesToFetch = getTokensToFetch({
    inventoryList,
    lookupTable: byToken,
    pageSize: summariespagesize,
  });
  if (!isEmpty(piSummariesToFetch)) {
    await dispatch(piSummaries.fetch({ tokens: piSummariesToFetch }));
  }
}
