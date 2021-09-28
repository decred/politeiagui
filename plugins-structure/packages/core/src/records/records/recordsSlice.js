import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RECORDS_PAGE_SIZE } from "../constants";
import { getRecordStatusCode, getRecordStateCode } from "../../utils";
import take from "lodash/fp/take";
import without from "lodash/fp/without";

// Possible status: 'idle' | 'loading' | 'succeeded' | 'failed'
const initialState = {
  records: {},
  /**
   * recordsFetchQueue:
   * {
   * [state]: {
   *     [status]: [...tokens]
   *   }
   * }
   */
  recordsFetchQueue: {},
  status: "idle",
  error: null,
};

// Thunks
export const fetchRecords = createAsyncThunk(
  "records/fetch",
  async (body, { getState, extra, rejectWithValue }) => {
    try {
      return await extra.fetchRecords(getState(), body);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const fetchRecordsNextPage = createAsyncThunk(
  "records/fetchNextPage",
  async (body = { pageSize: RECORDS_PAGE_SIZE }, { dispatch, getState }) => {
    let { pageSize, recordsState, status } = body;
    if (!pageSize) pageSize = RECORDS_PAGE_SIZE;
    if (!recordsState) throw Error("recordsState is required");
    if (!status) throw Error("status is required");
    const queue = getState().records.recordsFetchQueue[recordsState][status];
    const nextTokens = take(pageSize, queue);
    return await dispatch(fetchRecords(nextTokens));
  }
);

function setQueue(state, { recordsState, status, records }) {
  const newObj = {
    [recordsState]: {
      ...state.recordsFetchQueue[recordsState],
      [status]: records,
    },
  };
  state.recordsFetchQueue = {
    ...state.recordsFetchQueue,
    ...newObj,
  };
}

// Reducer
const recordsSlice = createSlice({
  name: "records",
  initialState,
  reducers: {
    // set the recordsFetchQueue object per state and status
    setFetchQueue(state, action) {
      const { recordsState, status, records } = action.payload;
      setQueue(state, { recordsState, status, records });
    },
    // push values into an already initialzed recordsFetchQueue
    pushFetchQueue(state, action) {
      const { recordsState, status, records } = action.payload;
      state.recordsFetchQueue[recordsState][status].push(...records);
    },
    // pop values from the recordsFetchQueue
    popFetchQueue(state, action) {
      const { recordsState, status, records } = action.payload;
      state.recordsFetchQueue[recordsState][status] = state.recordsFetchQueue[
        recordsState
      ][status].filter(
        (outerRecord) =>
          !records.find((innerRecord) => outerRecord === innerRecord)
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchRecords.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.records = { ...state.records, ...action.payload };
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchRecordsNextPage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecordsNextPage.fulfilled, (state, action) => {
        const { recordsState, status } = action.meta.arg;
        const recordsFetched = action.payload.meta.arg;
        const newQueue = without(
          recordsFetched,
          state.recordsFetchQueue[recordsState][status]
        );
        setQueue(state, { recordsState, status, records: newQueue });
      })
      .addCase(fetchRecordsNextPage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Actions - notice they have the same name than the properties on reducers
// that's because createSlice automatically generate action creators for us
export const { pushFetchQueue, setFetchQueue, popFetchQueue } =
  recordsSlice.actions;

// Selectors
// export const selectRecordsInventory = state => state.recordsInventory.recordsInventory;
export const selectRecordsStatus = (state) => state.records.status;
export const selectRecordByToken = (state, token) =>
  state.records.records[token];
export const selectRecords = (state) => state.records.records;
export const selectRecordsByStateAndStatus = (
  state,
  { recordsState, status }
) =>
  Object.values(state.records.records).filter((record) => {
    return (
      record.state === getRecordStateCode(recordsState) &&
      record.status === getRecordStatusCode(status)
    );
  });
export const selectRecordsFetchQueue = (state, { recordsState, status }) =>
  state.records.recordsFetchQueue[recordsState]
    ? state.records.recordsFetchQueue[recordsState][status]
    : [];
export const selectHasMoreRecordsToFetch = (state, { recordsState, status }) =>
  state.records.status === "idle" ||
  (state.records.recordsFetchQueue[recordsState] &&
    state.records.recordsFetchQueue[recordsState][status] &&
    state.records.recordsFetchQueue[recordsState][status].length > 0);

// Export default reducer
export default recordsSlice.reducer;
