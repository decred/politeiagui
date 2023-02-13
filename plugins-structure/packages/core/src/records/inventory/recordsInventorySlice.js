// createSlice is the main API function to define redux logic
// createAsyncThunk gnerate thunks that automatically dispatch
// start/success/failure actions
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getHumanReadableRecordState,
  getHumanReadableRecordStatus,
  getRecordStateCode,
  getRecordStatusCode,
} from "../utils";
import { getRecordsErrorMessage } from "../errors";
import {
  validateInventoryPageSize,
  validateRecordStateAndStatus,
} from "../validation";

const initialObj = {
  tokens: [],
  lastPage: 0,
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
  byUserId: {},
  byUserStatus: "idle",
  error: null,
};

// Thunks
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
        recordsState: requestRecordsState,
        status: requestStatus,
        page,
      });
      return {
        recordsInventory,
        inventoryPageSize,
      };
    } catch (e) {
      const message = getRecordsErrorMessage(e.body, e.message);
      return rejectWithValue(message);
    }
  },
  {
    condition: ({ recordsState, status }, { getState }) =>
      validateRecordStateAndStatus(recordsState, status) &&
      validateInventoryPageSize(getState()),
  }
);

/**
 * fetchRecordsUserInventory is an Async thunk responsible for fetching records
 * tokens for a given userid. `userid` must be valid.
 */
export const fetchRecordsUserInventory = createAsyncThunk(
  "recordsInventory/user",
  async ({ userid }, { extra, rejectWithValue }) => {
    try {
      return await extra.fetchRecordsUserInventory({
        userid,
      });
    } catch (e) {
      const message = getRecordsErrorMessage(e.body, e.message);
      return rejectWithValue(message);
    }
  },
  {
    condition: (params) => !!(params && params.userid),
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
          recordsInventory[stringState][readableStatus]?.length ===
          inventoryPageSize
        ) {
          state[stringState][readableStatus].status = "succeeded/hasMore";
        } else {
          state[stringState][readableStatus].status = "succeeded/isDone";
        }
        state[stringState][readableStatus].lastPage = page;
        state[stringState][readableStatus].tokens.push(
          ...(recordsInventory[stringState][readableStatus] || [])
        );
      })
      .addCase(fetchRecordsInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchRecordsUserInventory.pending, (state) => {
        state.byUserStatus = "loading";
      })
      .addCase(fetchRecordsUserInventory.fulfilled, (state, action) => {
        const { userid } = action.meta.arg;
        state.byUserId[userid] = action.payload;
        state.byUserStatus = "succeeded";
      })
      .addCase(fetchRecordsUserInventory.rejected, (state, action) => {
        state.byUserStatus = "failed";
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

export const selectRecordsInventoryByUser = (state, userid) =>
  state.recordsInventory.byUserId[userid];
export const selectRecordsUserInventoryStatus = (state) =>
  state.recordsInventory.byUserStatus;

// Export default reducer
export default recordsInventorySlice.reducer;
