import { listener } from "@politeiagui/core/listeners";
import { commentsCount } from "@politeiagui/comments/count";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { records } from "@politeiagui/core/records";
import { getTokensToFetch } from "@politeiagui/core/records/utils";
import { getHumanReadableTicketvoteStatus } from "@politeiagui/ticketvote/utils";
import isEmpty from "lodash/isEmpty";
import { fetchNextBatch } from "./actions";

const piFilenames = ["proposalmetadata.json", "votemetadata.json"];

async function fetchNextComments(state, dispatch, { inventoryList }) {
  const {
    commentsCount: { byToken, status },
    commentsPolicy: {
      policy: { countpagesize },
    },
  } = state;

  const commentsCountToFetch = getTokensToFetch({
    inventoryList,
    lookupTable: byToken,
    pageSize: countpagesize,
  });

  if (status !== "loading" && !isEmpty(commentsCountToFetch)) {
    await dispatch(
      commentsCount.fetch({
        tokens: commentsCountToFetch,
      })
    );
  }
}

async function fetchNextRecords(state, dispatch, { inventoryList }) {
  const {
    records: { records: recordsObj, status },
    recordsPolicy: {
      policy: { recordspagesize },
    },
  } = state;

  const recordsToFetch = getTokensToFetch({
    inventoryList,
    lookupTable: recordsObj,
    pageSize: recordspagesize,
  });

  if (status !== "loading" && !isEmpty(recordsToFetch)) {
    dispatch(
      records.fetch({
        tokens: recordsToFetch,
        filenames: piFilenames,
      })
    );
  }
}

async function fetchNextTicketvoteSummaries(
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

  if (status !== "loading" && !isEmpty(voteSummariesToFetch)) {
    await dispatch(
      ticketvoteSummaries.fetch({
        tokens: voteSummariesToFetch,
      })
    );
  }
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
    effect: async ({ payload }, { getState, dispatch }) => {
      const readableStatus = getHumanReadableTicketvoteStatus(payload);
      const { ticketvoteInventory } = getState();
      const inventoryList = ticketvoteInventory[readableStatus].tokens;
      await fetchNextTicketvoteSummaries(getState(), dispatch, {
        inventoryList,
      });
    },
  });
  listener.startListening({
    actionCreator: fetchNextBatch,
    effect: async ({ payload }, { getState, dispatch }) => {
      const readableStatus = getHumanReadableTicketvoteStatus(payload);
      const { ticketvoteInventory } = getState();
      const inventoryList = ticketvoteInventory[readableStatus].tokens;
      await fetchNextRecords(getState(), dispatch, {
        inventoryList,
      });
    },
  });
  listener.startListening({
    actionCreator: fetchNextBatch,
    effect: async ({ payload }, { getState, dispatch }) => {
      const readableStatus = getHumanReadableTicketvoteStatus(payload);
      const { ticketvoteInventory } = getState();
      const inventoryList = ticketvoteInventory[readableStatus].tokens;
      await fetchNextComments(getState(), dispatch, {
        inventoryList,
      });
    },
  });
}
