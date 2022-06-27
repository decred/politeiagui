import { listener } from "@politeiagui/core/listeners";
import { commentsCount } from "@politeiagui/comments/count";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { records } from "@politeiagui/core/records";
import { getTokensToFetch } from "@politeiagui/core/records/utils";
import { getHumanReadableTicketvoteStatus } from "@politeiagui/ticketvote/utils";
import isEmpty from "lodash/isEmpty";
import { fetchNextBatch } from "./actions";

const piFilenames = ["proposalmetadata.json", "votemetadata.json"];

function fetchNextBatchCommentsEffect(state, dispatch, { inventoryList }) {
  const {
    commentsCount: { byToken },
    commentsPolicy: {
      policy: { countpagesize },
    },
  } = state;

  const commentsCountToFetch = getTokensToFetch({
    inventoryList,
    lookupTable: byToken,
    pageSize: countpagesize,
  });

  return (
    !isEmpty(commentsCountToFetch) &&
    dispatch(
      commentsCount.fetch({
        tokens: commentsCountToFetch,
      })
    )
  );
}

function fetchNextBatchRecordsEffect(state, dispatch, { inventoryList }) {
  const {
    records: { records: recordsObj },
    recordsPolicy: {
      policy: { recordspagesize },
    },
  } = state;

  const recordsToFetch = getTokensToFetch({
    inventoryList,
    lookupTable: recordsObj,
    pageSize: recordspagesize,
  });

  return (
    !isEmpty(recordsToFetch) &&
    dispatch(
      records.fetch({
        tokens: recordsToFetch,
        filenames: piFilenames,
      })
    )
  );
}

function fetchNextBatchTicketvoteEffect(state, dispatch, { inventoryList }) {
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

  return (
    !isEmpty(voteSummariesToFetch) &&
    dispatch(
      ticketvoteSummaries.fetch({
        tokens: voteSummariesToFetch,
      })
    )
  );
}

export function startHomeListeners() {
  listener.startListening({
    type: "ticketvoteInventory/fetch/fulfilled",
    effect: ({ meta, payload }, listenerApi) => {
      if (payload.inventory[meta.arg.status].length > 0) {
        listenerApi.dispatch(fetchNextBatch(meta.arg.status));
      }
    },
  });
  listener.startListening({
    actionCreator: fetchNextBatch,
    effect: async ({ payload }, { getState, dispatch, ...listenerApi }) => {
      // Only allow one instance of this listener to run at a time
      listenerApi.unsubscribe();

      const readableStatus = getHumanReadableTicketvoteStatus(payload);
      const { ticketvoteInventory } = getState();
      const inventoryList = ticketvoteInventory[readableStatus].tokens;
      const ticketVoteAction = fetchNextBatchTicketvoteEffect(
        getState(),
        dispatch,
        { inventoryList }
      );
      const recordsAction = fetchNextBatchRecordsEffect(getState(), dispatch, {
        inventoryList,
      });
      const commentsAction = fetchNextBatchCommentsEffect(
        getState(),
        dispatch,
        {
          inventoryList,
        }
      );

      // Dispatches actions
      await Promise.all([recordsAction, ticketVoteAction, commentsAction]);

      // Re-enable the listener
      listenerApi.subscribe();
    },
  });
}
