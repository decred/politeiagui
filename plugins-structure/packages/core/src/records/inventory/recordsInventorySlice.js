// createSlice is the main API function to define redux logic
// createAsyncThunk gnerate thunks that automatically dispatch
// start/success/failure actions
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRecordStatusCode, getRecordStateCode } from "../../utils";
import {
  setRecordsFetchQueue,
  fetchRecordsNextPage,
} from "../records/recordsSlice";

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
    { recordsState, status, page },
    { dispatch, extra, rejectWithValue }
  ) => {
    try {
      const obj = {
        state: getRecordStateCode(recordsState),
        status: getRecordStatusCode(status),
        page,
      };
      const res = await extra.fetchRecordsInventory(obj);
      // Set the queue and fetch the first batch of records
      // Dispatching these actions here because they are necessary to populate the view and should run synchronously.
      // setRecordsFetchQueue should always be dispatched here unless you have a really good reason to do it anywhere else.
      // fetchRecordsNextPage should be called everytime the user wants to fetch a new batch.
      dispatch(
        setRecordsFetchQueue({
          recordsState,
          status,
          records: res[recordsState][status],
        })
      );
      dispatch(fetchRecordsNextPage({ recordsState, status }));
      return res;
    } catch (e) {
      return rejectWithValue(e.message);
    }
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
        state[recordsState][status].status = "loading";
      })
      .addCase(fetchRecordsInventory.fulfilled, (state, action) => {
        const recordsInventory = action.payload;
        const { recordsState, status, page } = action.meta.arg;
        state[recordsState][status].lastPage = page;
        if (recordsInventory[recordsState][status].length === 20) {
          state[recordsState][status].status = "succeeded/hasMore";
        } else {
          state[recordsState][status].status = "succeeded/isDone";
        }
        state[recordsState][status].tokens.push(
          ...recordsInventory[recordsState][status]
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
) => state.recordsInventory[recordsState][status].tokens;
export const selectRecordsInventoryStatus = (state, { recordsState, status }) =>
  state.recordsInventory[recordsState][status].status;
export const selectRecordsInventoryLastPage = (
  state,
  { recordsState, status }
) => state.recordsInventory[recordsState][status].lastPage;

// Export default reducer
export default recordsInventorySlice.reducer;
