import { ticketvoteSummaries } from "./";
import {
  getTokensBatchesToFetch,
  getTokensToFetch,
} from "@politeiagui/core/records/utils";
import isEmpty from "lodash/isEmpty";

export async function fetchRecordTicketvoteSummaries(
  state,
  dispatch,
  { token }
) {
  const hasVoteSummary = ticketvoteSummaries.selectByToken(state, token);
  if (!hasVoteSummary)
    await dispatch(ticketvoteSummaries.fetch({ tokens: [token] }));
}

export async function fetchNextTicketvoteSummaries(
  state,
  dispatch,
  { inventoryList }
) {
  const {
    ticketvoteSummaries: { byToken },
    ticketvotePolicy: {
      policy: { summariespagesize },
    },
  } = state;

  const voteSummariesToFetch = getTokensToFetch({
    inventoryList,
    lookupTable: byToken,
    pageSize: summariespagesize,
  });

  if (!isEmpty(voteSummariesToFetch)) {
    await dispatch(
      ticketvoteSummaries.fetch({
        tokens: voteSummariesToFetch,
      })
    );
  }
}

export function fetchAllTicketvoteSummaries(
  state,
  dispatch,
  { inventoryList }
) {
  const {
    ticketvoteSummaries: { byToken },
    ticketvotePolicy: {
      policy: { summariespagesize },
    },
  } = state;
  const voteSummariesToFetch = getTokensBatchesToFetch({
    inventoryList,
    lookupTable: byToken,
    pageSize: summariespagesize,
  });
  voteSummariesToFetch.forEach((batch) => {
    dispatch(ticketvoteSummaries.fetch({ tokens: batch }));
  });
}
