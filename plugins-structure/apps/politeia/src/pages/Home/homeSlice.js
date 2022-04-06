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
import {
  validateInventoryIsLoaded,
  validateInventoryListLength,
} from "./validation";
import { piSummaries } from "../../pi";
import { validatePiSummariesPageSize } from "../../pi/validation";

const initialStateStatus = {
  lastTokenPos: null,
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
        recordsPolicy,
        ticketvotePolicy,
        pi,
        home,
      } = getState();
      // Get all pages sizes allowed
      const ticketvoteSummariesPageSize =
        ticketvotePolicy.policy.summariespagesize;
      const recordsPageSize = recordsPolicy.policy.recordspagesize;
      const piSummariesPageSize = pi.policy.policy.summariespagesize;
      // TODO: Add piSummariesPageSize
      const readableStatus = getHumanReadableTicketvoteStatus(status);
      // get tokens batch to perform the dispatches
      const { tokens, last } = getTokensToFetch({
        records: recordsObject.records,
        // pageSize is the minimum value between all pages sizes, so we can
        // sync all requests with the same tokens batch
        pageSize: Math.min(
          ticketvoteSummariesPageSize,
          recordsPageSize,
          piSummariesPageSize
        ),
        // inventoryList corresponds to all tokens from given ticketvote
        // inventory
        inventoryList: ticketvoteInventory[readableStatus].tokens,
        // lastTokenPos is the pointer that indicates the tokens batch index on
        // homeSlice
        lastTokenPos: home[readableStatus].lastTokenPos,
      });
      // dispatches
      await Promise.all([
        dispatch(records.fetch({ tokens, filenames: piFilenames })),
        dispatch(ticketvoteSummaries.fetch({ tokens })),
        dispatch(piSummaries.fetch({ tokens })),
      ]);
      // returns the last token index so we can update our `lastTokenPos`
      // pointer
      return last;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
  {
    condition: (status, { getState }) =>
      validateTicketvoteStatus(status) &&
      validateRecordsPageSize(getState()) &&
      validateTicketvoteSummariesPageSize(getState()) &&
      validatePiSummariesPageSize(getState()) &&
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
        state[readableStatus].lastTokenPos = last;
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
  return state.home[readableStatus].lastTokenPos;
};
export const selectStatus = (state, status) => {
  const readableStatus = getHumanReadableTicketvoteStatus(status);
  return state.home[readableStatus].status;
};

// Export default reducer
export default homeSlice.reducer;
