import { listener } from "@politeiagui/core/listeners";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { commentsCount } from "@politeiagui/comments/count";
import { getTokensToFetch } from "@politeiagui/core/records/utils";
import { getHumanReadableTicketvoteStatus } from "@politeiagui/ticketvote/utils";
import isEmpty from "lodash/isEmpty";
import { fetchNextBatch } from "./actions";

const piFilenames = ["proposalmetadata.json", "votemetadata.json"];

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

      // Get all required states from packages slices
      const {
        ticketvoteInventory,
        records: recordsObject,
        ticketvoteSummaries: voteSummariesObj,
        commentsCount: commentsCountObj,
        recordsPolicy,
        commentsPolicy,
        ticketvotePolicy,
      } = getState();

      // Get all pages sizes allowed
      const ticketvoteSummariesPageSize =
        ticketvotePolicy.policy.summariespagesize;
      const recordsPageSize = recordsPolicy.policy.recordspagesize;
      const commentsCountPageSize = commentsPolicy.policy.countpagesize;
      // TODO: Add piSummariesPageSize

      // Get tokens pageSize tokens to fire the dispatchs
      // Skip those already loaded
      const inventoryList = ticketvoteInventory[readableStatus].tokens;
      const recordsToFetch = getTokensToFetch({
        inventoryList,
        lookupTable: recordsObject.records,
        pageSize: recordsPageSize,
      });
      const voteSummariesToFetch = getTokensToFetch({
        inventoryList,
        lookupTable: voteSummariesObj.byToken,
        pageSize: ticketvoteSummariesPageSize,
      });
      const commentsCountToFetch = getTokensToFetch({
        inventoryList,
        lookupTable: commentsCountObj.byToken,
        pageSize: commentsCountPageSize,
      });

      // Dispatches if tokens are not empty
      await Promise.all([
        !isEmpty(recordsToFetch) &&
          dispatch(
            records.fetch({
              tokens: recordsToFetch,
              filenames: piFilenames,
            })
          ),
        !isEmpty(voteSummariesToFetch) &&
          dispatch(
            ticketvoteSummaries.fetch({
              tokens: voteSummariesToFetch,
            })
          ),
        !isEmpty(commentsCountToFetch) &&
          dispatch(
            commentsCount.fetch({
              tokens: commentsCountToFetch,
            })
          ),
      ]);

      // Re-enable the listener
      listenerApi.subscribe();
    },
  });
}
