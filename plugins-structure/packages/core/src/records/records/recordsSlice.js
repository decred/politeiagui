import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRecordStateCode, getRecordStatusCode } from "../utils";
import { validateRecordStateAndStatus } from "../validation";
import isArray from "lodash/fp/isArray";
import pick from "lodash/fp/pick";
import compose from "lodash/fp/compose";
import values from "lodash/fp/values";

// Possible status: 'idle' | 'loading' | 'succeeded' | 'failed'
export const initialState = {
  records: {},
  status: "idle",
  error: null,
};

// Thunks

/**
 * fetchRecords async thunk responsible for fetching records for given
 * { token, filename } array.
 *
 * @returns {Array} Records
 */
export const fetchRecords = createAsyncThunk(
  "records/fetch",
  async ({ tokens, filenames = [] }, { getState, extra, rejectWithValue }) => {
    try {
      return await extra.fetchRecords(getState(), tokens, filenames);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
  {
    condition: ({ tokens }) => isArray(tokens),
  }
);

export const fetchRecordDetails = createAsyncThunk(
  "records/fetchDetails",
  async ({ token }, { getState, extra, rejectWithValue }) => {
    try {
      return await extra.fetchRecordDetails(getState(), token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: ({ token }) => !!token && typeof token === "string",
  }
);

// Reducer
const recordsSlice = createSlice({
  name: "records",
  initialState,
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
      .addCase(fetchRecordDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecordDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        const record = action.payload;
        const { token } = record.censorshiprecord;
        state.records[token] = record;
      })
      .addCase(fetchRecordDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectRecordsStatus = (state) => state.records.status;
export const selectRecordByToken = (state, token) =>
  state.records.records[token];
export const selectRecords = (state) => state.records.records;
export const selectRecordsByStateAndStatus = (
  state,
  { recordsState, status }
) => {
  if (validateRecordStateAndStatus(recordsState, status)) {
    // We have valid record state and status.
    const records = state.records.records;
    const res = {};
    for (const token in records) {
      if (
        records[token].state === getRecordStateCode(recordsState) &&
        records[token].status === getRecordStatusCode(status)
      ) {
        res[token] = records[token];
      }
    }
    return res;
  }
};

export const selectRecordsByTokensBatch = (state, tokens) =>
  compose(values, pick(tokens))(state.records.records);

// Export default reducer
export default recordsSlice.reducer;
