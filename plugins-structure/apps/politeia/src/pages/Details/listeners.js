import { listener } from "@politeiagui/core/listeners";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { recordComments } from "@politeiagui/comments/comments";
import { piSummaries } from "../../pi";
import { fetchProposalDetails } from "./actions";
import { selectFullTokenFromStore } from "./selectors";

async function getFullToken(state, dispatch, token) {
  const storeToken = selectFullTokenFromStore(state, token);
  if (storeToken) {
    const record = records.selectByToken(state, storeToken);
    // means details was already fetched
    if (record.files.length === 2) {
      return [storeToken, true];
    }
    return [storeToken, false];
  }
  const res = await dispatch(records.fetchDetails({ token }));
  const fetchedRecord = res.payload;
  return [fetchedRecord?.censorshiprecord?.token, true];
}

export function startDetailsListeners() {
  listener.startListening({
    actionCreator: fetchProposalDetails,
    effect: async ({ payload }, { getState, dispatch, ...listenerApi }) => {
      // Only allow one instance of this listener to run at a time
      listenerApi.unsubscribe();

      const state = getState();
      const [fullToken, detailsFetched] = await getFullToken(
        state,
        dispatch,
        payload
      );
      const hasVoteSummary = ticketvoteSummaries.selectByToken(
        state,
        fullToken
      );
      const hasComments = recordComments.selectByToken(state, fullToken);
      const hasPiSummaries = piSummaries.selectByToken(state, fullToken);

      await Promise.all([
        !detailsFetched && dispatch(records.fetchDetails({ token: fullToken })),
        !hasComments && dispatch(recordComments.fetch({ token: fullToken })),
        !hasVoteSummary &&
          dispatch(ticketvoteSummaries.fetch({ tokens: [fullToken] })),
        !hasPiSummaries && dispatch(piSummaries.fetch({ tokens: [fullToken] })),
      ]);

      // Re-enable the listener
      listenerApi.subscribe();
    },
  });
}
