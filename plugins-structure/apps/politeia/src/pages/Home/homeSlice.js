import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
      const {
        ticketvoteInventory,
        records: recordsObject,
        recordsPolicy,
        ticketvotePolicy,
        home,
      } = getState();

      const summariesPageSize = ticketvotePolicy.policy.summariespagesize;
      const recordsPageSize = recordsPolicy.policy.recordspagesize;
      const readableStatus = getHumanReadableTicketvoteStatus(status);
      const { tokens, last } = getTokensToFetch({
        records: recordsObject.records,
        pageSize: Math.min(summariesPageSize, recordsPageSize),
        inventoryList: ticketvoteInventory[readableStatus].tokens,
        lastTokenPos: home[readableStatus].lastTokenPos,
      });

      await Promise.all([
        dispatch(records.fetch({ tokens, filenames: piFilenames })),
        dispatch(ticketvoteSummaries.fetch({ tokens })),
      ]);
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
