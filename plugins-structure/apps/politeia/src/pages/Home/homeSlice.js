import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTokensToFetch } from "@politeiagui/core/records/utils";
import { validateRecordsPageSize } from "@politeiagui/core/records/validation";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { getHumanReadableTicketvoteStatus } from "@politeiagui/ticketvote/utils";
import {
  validateTicketvoteStatus,
  validateTicketvoteSummariesPageSize,
} from "@politeiagui/ticketvote/validation";
import { records } from "@politeiagui/core/records";
import { commentsCount } from "@politeiagui/comments/count";
import {
  validateInventoryIsLoaded,
  validateInventoryListLength,
} from "./validation";
import isEmpty from "lodash/isEmpty";

const initialStateStatus = {
  lastTokenPosBySlice: {
    records: null,
    ticketvoteSummaries: null,
    commentsCount: null,
  },
  status: "idle",
  error: null,
};

export const initialState = {
  unauthorized: initialStateStatus,
  authorized: initialStateStatus,
  started: initialStateStatus,
  finished: initialStateStatus,
  approved: initialStateStatus,
  rejected: initialStateStatus,
  ineligible: initialStateStatus,
};

const piFilenames = ["proposalmetadata.json", "votemetadata.json"];

// Thunks
export const fetchNextBatch = createAsyncThunk(
  "home/fetchNextBatch",
  async (status, { dispatch, rejectWithValue, getState }) => {
    try {
      // Get all required states from packages slices
      const {
        ticketvoteInventory,
        records: recordsObject,
        ticketvoteSummaries: voteSummariesObj,
        commentsCount: commentsCountObj,
        recordsPolicy,
        commentsPolicy,
        ticketvotePolicy,
        home,
      } = getState();
      // Get all pages sizes allowed
      const ticketvoteSummariesPageSize =
        ticketvotePolicy.policy.summariespagesize;
      const recordsPageSize = recordsPolicy.policy.recordspagesize;
      const commentsCountPageSize = commentsPolicy.policy.countpagesize;
      // TODO: Add piSummariesPageSize

      const readableStatus = getHumanReadableTicketvoteStatus(status);
      const { lastTokenPosBySlice } = home[readableStatus];

      // get tokens batch for each slice to perform the dispatches
      const [recordsToFetch, voteSummariesToFetch, commentsCountToFetch] = [
        {
          records: recordsObject.records,
          pageSize: recordsPageSize,
          lastTokenPos: lastTokenPosBySlice.records,
          inventoryList: ticketvoteInventory[readableStatus].tokens,
        },
        {
          records: voteSummariesObj.byToken,
          pageSize: ticketvoteSummariesPageSize,
          lastTokenPos: lastTokenPosBySlice.ticketvoteSummaries,
          inventoryList: ticketvoteInventory[readableStatus].tokens,
        },
        {
          records: commentsCountObj.byToken,
          pageSize: commentsCountPageSize,
          lastTokenPos: lastTokenPosBySlice.commentsCount,
          inventoryList: ticketvoteInventory[readableStatus].tokens,
        },
      ].map(getTokensToFetch);

      // dispatches if tokens are not empty
      await Promise.all([
        !isEmpty(recordsToFetch.tokens) &&
          dispatch(
            records.fetch({
              tokens: recordsToFetch.tokens,
              filenames: piFilenames,
            })
          ),
        !isEmpty(voteSummariesToFetch.tokens) &&
          dispatch(
            ticketvoteSummaries.fetch({
              tokens: voteSummariesToFetch.tokens,
            })
          ),
        !isEmpty(commentsCountToFetch.tokens) &&
          dispatch(
            commentsCount.fetch({
              tokens: commentsCountToFetch.tokens,
            })
          ),
      ]);
      // returns the last token index so we can update our `lastTokenPos`
      // pointer for every slice
      return {
        records: recordsToFetch.last,
        ticketvoteSummaries: voteSummariesToFetch.last,
        commentsCount: commentsCountToFetch.last,
      };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
  {
    condition: (status, { getState }) =>
      validateTicketvoteStatus(status) &&
      validateRecordsPageSize(getState()) &&
      validateTicketvoteSummariesPageSize(getState()) &&
      validateInventoryIsLoaded(
        getState().ticketvoteInventory[status].tokens
      ) &&
      validateInventoryListLength(
        getState().ticketvoteInventory[status].tokens
      ),
  }
);

// Reducer
const homeSlice = createSlice({
  name: "home",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchNextBatch.pending, (state, action) => {
        const status = action.meta.arg;
        const readableStatus = getHumanReadableTicketvoteStatus(status);
        state[readableStatus].status = "loading";
      })
      .addCase(fetchNextBatch.fulfilled, (state, action) => {
        const last = action.payload;
        const status = action.meta.arg;
        const readableStatus = getHumanReadableTicketvoteStatus(status);
        state[readableStatus].lastTokenPosBySlice = last;
        state[readableStatus].status = "succeeded";
      })
      .addCase(fetchNextBatch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectLastToken = (state, status) => {
  const readableStatus = getHumanReadableTicketvoteStatus(status);
  return state.home[readableStatus].lastTokenPosBySlice.records;
};
export const selectStatus = (state, status) => {
  const readableStatus = getHumanReadableTicketvoteStatus(status);
  return state.home[readableStatus].status;
};

// Export default reducer
export default homeSlice.reducer;
