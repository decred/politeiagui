// createSlice is the main API function to define redux logic
// createAsyncThunk gnerate thunks that automatically dispatch
// start/success/failure actions
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getHumanReadableRecordState,
  getHumanReadableRecordStatus,
  getRecordStateCode,
  getRecordStatusCode,
  getTokensToFetch,
} from "../utils";
import {
  validateInventoryPageSize,
  validateRecordStateAndStatus,
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
      const readableRecordsState = getHumanReadableRecordState(recordsState);
      const readableStatus = getHumanReadableRecordStatus(status);
      const { recordsInventory, records, recordsPolicy } = getState();
      const { tokens: invTokens, lastTokenPos } =
        recordsInventory[readableRecordsState][readableStatus];

      const { tokens, last } = getTokensToFetch({
        records: records.records,
        pageSize: recordsPolicy.policy.recordspagesize,
        inventoryList: invTokens,
        lastTokenPos,
      });

      await dispatch(fetchRecords({ tokens }));
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

/**
 * fetchRecordsInventory is an Async thunk responsible for fetching a
 * paginated inventory for given `recordsState`, `status` and `page`
 * parameters. `recordsState` and `status` must be valid.
 */
export const fetchRecordsInventory = createAsyncThunk(
  "recordsInventory/fetch",
  async (
    { recordsState, status, page = 1 },
    { extra, rejectWithValue, getState }
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
        const readableStatus = getHumanReadableRecordStatus(status);
        state[stringState][readableStatus].status = "loading";
      })
      .addCase(fetchRecordsInventory.fulfilled, (state, action) => {
        const { recordsInventory, inventoryPageSize } = action.payload;
        const { recordsState, status, page } = action.meta.arg;
        const stringState = getHumanReadableRecordState(recordsState);
        const readableStatus = getHumanReadableRecordStatus(status);
        if (
          recordsInventory[stringState][readableStatus].length ===
          inventoryPageSize
        ) {
          state[stringState][readableStatus].status = "succeeded/hasMore";
        } else {
          state[stringState][readableStatus].status = "succeeded/isDone";
        }
        state[stringState][readableStatus].lastPage = page;
        state[stringState][readableStatus].tokens.push(
          ...recordsInventory[stringState][readableStatus]
        );
      })
      .addCase(fetchRecordsInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchNextRecordsBatch.pending, (state) => state)
      .addCase(fetchNextRecordsBatch.fulfilled, (state, action) => {
        const { recordsState, status } = action.meta.arg;
        const stringState = getHumanReadableRecordState(recordsState);
        const readableStatus = getHumanReadableRecordStatus(status);
        state[stringState][readableStatus].lastTokenPos = action.payload;
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
    const readableRecordsState = getHumanReadableRecordState(recordsState);
    const readableStatus = getHumanReadableRecordStatus(status);
    return state.recordsInventory[readableRecordsState][readableStatus].tokens;
  }
};
export const selectRecordsInventoryStatus = (
  state,
  { recordsState, status }
) => {
  if (validateRecordStateAndStatus(recordsState, status)) {
    // We have valids record state and status.
    // Convert them to strings if they are not.
    const readableRecordsState = getHumanReadableRecordState(recordsState);
    const readableStatus = getHumanReadableRecordStatus(status);
    return state.recordsInventory[readableRecordsState][readableStatus].status;
  }
};

export const selectHasMoreRecordsToFetch = (
  state,
  { recordsState, status }
) => {
  if (validateRecordStateAndStatus(recordsState, status)) {
    // We have valids record state and status.
    // Convert them to strings if they are not.
    const readableRecordsState = getHumanReadableRecordState(recordsState);
    const readableStatus = getHumanReadableRecordStatus(status);
    const statusInventory =
      state.recordsInventory[readableRecordsState][readableStatus];
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
    const readableRecordsState = getHumanReadableRecordState(recordsState);
    const readableStatus = getHumanReadableRecordStatus(status);
    return state.recordsInventory[readableRecordsState][readableStatus]
      .lastPage;
  }
};

// Export default reducer
export default recordsInventorySlice.reducer;
