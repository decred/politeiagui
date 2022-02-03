// createSlice is the main API function to define redux logic
// createAsyncThunk gnerate thunks that automatically dispatch
// start/success/failure actions
import take from "lodash/fp/take";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getHumanReadableRecordState,
  getRecordStatusCode,
  getRecordStateCode,
  getHumanReadableRecordStatus,
  skipTokensAlreadyLoaded,
  getTokensToFetch,
} from "../utils";
import {
  validateRecordStateAndStatus,
  validateInventoryPageSize,
  validateRecordsPageSize,
} from "../validation";
import { fetchRecords } from "../records/recordsSlice";

const initialObj = {
  tokens: [],
  lastPage: 0,
  lastTokenPos: null,
  status: "idle",
};

export const initialState = {
  unvetted: {
    censored: initialObj,
    unreviewed: initialObj,
  },
  vetted: {
    archived: initialObj,
    censored: initialObj,
    public: initialObj,
  },
  error: null,
};

// Thunks
export const fetchNextRecordsBatch = createAsyncThunk(
  "recordsInventry/fetchNextRecordsBatch",
  async ({ recordsState, status }, { dispatch, rejectWithValue, getState }) => {
    try {
      const stringRecordsState = getHumanReadableRecordState(recordsState);
      const stringStatus = getHumanReadableRecordStatus(status);
      const { recordsInventory, records, recordsPolicy } = getState();

      const { tokens, last } = getTokensToFetch({
        records,
        pageSize: recordsPolicy.policy.recordspagesize,
        inventory: recordsInventory[stringRecordsState][stringStatus],
      });

      await dispatch(fetchRecords(tokens));
      return last;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
  {
    condition: ({ recordsState, status }, { getState }) =>
      validateRecordStateAndStatus(recordsState, status) &&
      validateRecordsPageSize(getState()),
  }
);

export const fetchRecordsInventory = createAsyncThunk(
  "recordsInventory/fetch",
  async (
    { recordsState, status, page = 1 },
    { dispatch, extra, rejectWithValue, getState }
  ) => {
    const state = getState();
    const requestRecordsState = getRecordStateCode(recordsState);
    const requestStatus = getRecordStatusCode(status);
    const { inventorypagesize: inventoryPageSize } = state.recordsPolicy.policy;
    try {
      const recordsInventory = await extra.fetchRecordsInventory({
        state: requestRecordsState,
        status: requestStatus,
        page,
      });
      return {
        recordsInventory,
        inventoryPageSize,
      };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
  {
    condition: ({ recordsState, status }, { getState }) =>
      validateRecordStateAndStatus(recordsState, status) &&
      validateInventoryPageSize(getState()),
  }
);

// Reducer
const recordsInventorySlice = createSlice({
  name: "recordsInventory",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchRecordsInventory.pending, (state, action) => {
        const { recordsState, status } = action.meta.arg;
        const stringState = getHumanReadableRecordState(recordsState);
        const stringStatus = getHumanReadableRecordStatus(status);
        state[stringState][stringStatus].status = "loading";
      })
      .addCase(fetchRecordsInventory.fulfilled, (state, action) => {
        const { recordsInventory, inventoryPageSize } = action.payload;
        const { recordsState, status, page } = action.meta.arg;
        const stringState = getHumanReadableRecordState(recordsState);
        const stringStatus = getHumanReadableRecordStatus(status);
        if (
          recordsInventory[stringState][stringStatus].length ===
          inventoryPageSize
        ) {
          state[stringState][stringStatus].status = "succeeded/hasMore";
        } else {
          state[stringState][stringStatus].status = "succeeded/isDone";
        }
        state[stringState][stringStatus].lastPage = page;
        state[stringState][stringStatus].tokens.push(
          ...recordsInventory[stringState][stringStatus]
        );
      })
      .addCase(fetchRecordsInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchNextRecordsBatch.pending, (state, action) => state)
      .addCase(fetchNextRecordsBatch.fulfilled, (state, action) => {
        const { recordsState, status } = action.meta.arg;
        const stringState = getHumanReadableRecordState(recordsState);
        const stringStatus = getHumanReadableRecordStatus(status);
        state[stringState][stringStatus].lastTokenPos = action.payload;
      })
      .addCase(fetchNextRecordsBatch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectRecordsInventoryByStateAndStatus = (
  state,
  { recordsState, status }
) => {
  if (validateRecordStateAndStatus(recordsState, status)) {
    // We have valids record state and status.
    // Convert them to strings if they are not.
    const stringRecordsState = getHumanReadableRecordState(recordsState);
    const stringStatus = getHumanReadableRecordStatus(status);
    return state.recordsInventory[stringRecordsState][stringStatus].tokens;
  }
};
export const selectRecordsInventoryStatus = (
  state,
  { recordsState, status }
) => {
  if (validateRecordStateAndStatus(recordsState, status)) {
    // We have valids record state and status.
    // Convert them to strings if they are not.
    const stringRecordsState = getHumanReadableRecordState(recordsState);
    const stringStatus = getHumanReadableRecordStatus(status);
    return state.recordsInventory[stringRecordsState][stringStatus].status;
  }
};

export const selectHasMoreRecordsToFetch = (
  state,
  { recordsState, status }
) => {
  if (validateRecordStateAndStatus(recordsState, status)) {
    // We have valids record state and status.
    // Convert them to strings if they are not.
    const stringRecordsState = getHumanReadableRecordState(recordsState);
    const stringStatus = getHumanReadableRecordStatus(status);
    const statusInventory =
      state.recordsInventory[stringRecordsState][stringStatus];
    return statusInventory.lastTokenPos < statusInventory.tokens.length - 1;
  }
};

export const selectRecordsInventoryLastPage = (
  state,
  { recordsState, status }
) => {
  if (validateRecordStateAndStatus(recordsState, status)) {
    // We have valids record state and status.
    // Convert them to strings if they are not.
    const stringRecordsState = getHumanReadableRecordState(recordsState);
    const stringStatus = getHumanReadableRecordStatus(status);
    return state.recordsInventory[stringRecordsState][stringStatus].lastPage;
  }
};

// Export default reducer
export default recordsInventorySlice.reducer;
