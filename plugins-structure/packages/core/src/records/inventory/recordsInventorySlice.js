// createSlice is the main API function to define redux logic
// createAsyncThunk gnerate thunks that automatically dispatch
// start/success/failure actions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getHumanReadableRecordState,
  getRecordStatusCode,
  getRecordStateCode,
  getHumanReadableRecordStatus,
} from "../utils";
import { validateRecordStateAndStatus } from "../validation";
import { setFetchQueue, fetchRecordsNextPage } from "../records/recordsSlice";

const initialObj = {
  tokens: [],
  lastPage: 0,
  status: "idle",
};

const initialState = {
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
export const fetchRecordsInventory = createAsyncThunk(
  "recordsInventory/fetch",
  async (
    { recordsState, status, page = 1 },
    { dispatch, extra, rejectWithValue }
  ) => {
    const requestState = getRecordStateCode(recordsState);
    const requestStatus = getRecordStatusCode(status);
    try {
      const obj = {
        state: requestState,
        status: requestStatus,
        page,
      };
      const res = await extra.fetchRecordsInventory(obj);
      // Set the queue and fetch the first batch of records
      // Dispatching these actions here because they are necessary to populate the view and should run synchronously.
      // setFetchQueue should always be dispatched here unless you have a really good reason to do it anywhere else.
      // fetchRecordsNextPage should be called everytime the user wants to fetch a new batch.
      const stringState = getHumanReadableRecordState(recordsState);
      const stringStatus = getHumanReadableRecordStatus(status);
      dispatch(
        setFetchQueue({
          recordsState: stringState,
          status: stringStatus,
          records: res[stringState][stringStatus],
        })
      );
      dispatch(
        fetchRecordsNextPage({
          recordsState: stringState,
          status: stringStatus,
        })
      );
      return res;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
  {
    condition: ({ recordsState, status }) =>
      validateRecordStateAndStatus(recordsState, status),
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
        const recordsInventory = action.payload;
        const { recordsState, status, page } = action.meta.arg;
        const stringState = getHumanReadableRecordState(recordsState);
        const stringStatus = getHumanReadableRecordStatus(status);
        if (recordsInventory[stringState][stringStatus].length === 20) {
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
        state.error = action.error.message;
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
