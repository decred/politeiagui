import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RECORDS_PAGE_SIZE } from "../constants";
import {
  getHumanReadableRecordState,
  getHumanReadableRecordStatus,
  getRecordStatusCode,
  getRecordStateCode,
} from "../utils";
import { validateRecordStateAndStatus } from "../validation";
import take from "lodash/fp/take";
import isArray from "lodash/fp/isArray";
import without from "lodash/fp/without";

// Possible status: 'idle' | 'loading' | 'succeeded' | 'failed'
export const initialState = {
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
  },
  {
    condition: (records) => isArray(records),
  }
);

export const fetchRecordsNextPage = createAsyncThunk(
  "records/fetchNextPage",
  async (body, { dispatch, getState }) => {
    const { recordsState, status } = body;
    let { pageSize } = body;
    if (!pageSize) pageSize = RECORDS_PAGE_SIZE;
    const stringState = getHumanReadableRecordState(recordsState);
    const stringStatus = getHumanReadableRecordStatus(status);
    const queue =
      getState().records.recordsFetchQueue[stringState][stringStatus];
    const nextTokens = take(pageSize, queue);
    return await dispatch(fetchRecords(nextTokens));
  },
  {
    condition: ({ recordsState, status }) =>
      validateRecordStateAndStatus(recordsState, status),
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
      if (!isArray(records)) throw TypeError("records must be an array");
      const stringState = getHumanReadableRecordState(recordsState);
      const stringStatus = getHumanReadableRecordStatus(status);
      setQueue(state, {
        recordsState: stringState,
        status: stringStatus,
        records,
      });
    },
    // push values into an already initialzed recordsFetchQueue
    pushFetchQueue(state, action) {
      const { recordsState, status, records } = action.payload;
      if (!isArray(records)) throw TypeError("records must be an array");
      const stringState = getHumanReadableRecordState(recordsState);
      const stringStatus = getHumanReadableRecordStatus(status);
      if (
        state.recordsFetchQueue[stringState] &&
        state.recordsFetchQueue[stringState][stringStatus]
      ) {
        state.recordsFetchQueue[stringState][stringStatus].push(...records);
      } else {
        setQueue(state, {
          recordsState: stringState,
          status: stringStatus,
          records,
        });
      }
    },
    // pop values from the recordsFetchQueue
    popFetchQueue(state, action) {
      const { recordsState, status, records } = action.payload;
      const stringState = getHumanReadableRecordState(recordsState);
      const stringStatus = getHumanReadableRecordStatus(status);
      state.recordsFetchQueue[stringState][stringStatus] =
        state.recordsFetchQueue[stringState][stringStatus].filter(
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
        const stringState = getHumanReadableRecordState(recordsState);
        const stringStatus = getHumanReadableRecordStatus(status);
        const newQueue = without(
          recordsFetched,
          state.recordsFetchQueue[stringState][stringStatus]
        );
        setQueue(state, {
          recordsState: stringState,
          status: stringStatus,
          records: newQueue,
        });
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
) => {
  if (validateRecordStateAndStatus(recordsState, status)) {
    // We have valids record state and status.
    return Object.values(state.records.records).filter((record) => {
      return (
        record.state === getRecordStateCode(recordsState) &&
        record.status === getRecordStatusCode(status)
      );
    });
  }
};

export const selectRecordsFetchQueue = (state, { recordsState, status }) => {
  if (validateRecordStateAndStatus(recordsState, status)) {
    // We have valids record state and status.
    // Convert them to strings if they are not.
    const stringRecordsState = getHumanReadableRecordState(recordsState);
    const stringStatus = getHumanReadableRecordStatus(status);
    return state.records.recordsFetchQueue[stringRecordsState]
      ? state.records.recordsFetchQueue[stringRecordsState][stringStatus]
      : [];
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
    return (
      state.records.status === "idle" ||
      (state.records.recordsFetchQueue[stringRecordsState] &&
        state.records.recordsFetchQueue[stringRecordsState][stringStatus] &&
        state.records.recordsFetchQueue[stringRecordsState][stringStatus]
          .length > 0)
    );
  }
};

// Export default reducer
export default recordsSlice.reducer;
