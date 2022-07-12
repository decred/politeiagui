import { ticketvoteSummaries } from "./";
import { getTokensToFetch } from "@politeiagui/core/records/utils";
import isEmpty from "lodash/isEmpty";

export async function fetchRecordTicketvoteSummaries(
  state,
  dispatch,
  { token }
) {
  const hasVoteSummary = ticketvoteSummaries.selectByToken(state, token);
  const voteSummaryStatus = ticketvoteSummaries.selectStatus(state);

  if (!hasVoteSummary && voteSummaryStatus !== "loading")
    await dispatch(ticketvoteSummaries.fetch({ tokens: [token] }));
}

export async function fetchNextTicketvoteSummaries(
  state,
  dispatch,
  { inventoryList }
) {
  const {
    ticketvoteSummaries: { byToken, status },
    ticketvotePolicy: {
      policy: { summariespagesize },
    },
  } = state;

  const voteSummariesToFetch = getTokensToFetch({
    inventoryList,
    lookupTable: byToken,
    pageSize: summariespagesize,
  });

  if (!isEmpty(voteSummariesToFetch) && status !== "loading") {
    await dispatch(
      ticketvoteSummaries.fetch({
        tokens: voteSummariesToFetch,
      })
    );
  }
}
