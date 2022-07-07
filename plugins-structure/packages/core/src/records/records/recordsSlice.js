import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRecordStateCode, getRecordStatusCode } from "../utils";
import { validateRecordStateAndStatus } from "../validation";
import { getRecordsErrorMessage } from "../errors";
import { getShortToken } from "../utils";
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
      const message = getRecordsErrorMessage(e.body, e.message);
      return rejectWithValue(message);
    }
  },
  {
    condition: ({ tokens }) => isArray(tokens),
  }
);

/**
 * fetchRecordDetails async thunk responsible for fetching record details for
 * given { token }.
 *
 * @params {Object} { token: String }
 * @returns {Object} Record Details
 */
export const fetchRecordDetails = createAsyncThunk(
  "records/fetchDetails",
  async ({ token, version }, { getState, extra, rejectWithValue }) => {
    try {
      return await extra.fetchRecordDetails(getState(), { token, version });
    } catch (error) {
      const message = getRecordsErrorMessage(error.body, error.message);
      return rejectWithValue(message);
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
      .addCase(fetchRecordDetails.pending, (state, action) => {
        console.log(action);
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
export const selectRecordsError = (state) => state.records.error;
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

export const selectFullToken = (state, token) => {
  const allRecords = selectRecords(state);
  if (token.length > 7) {
    return token;
  }
  // is already in the store
  if (Object.keys(allRecords).length !== 0) {
    for (const key of Object.keys(allRecords)) {
      // it's loaded
      if (getShortToken(key) === token) {
        return key;
      }
    }
  }
  return null;
};

export const selectRecordsByTokensBatch = (state, tokens) =>
  compose(values, pick(tokens))(state.records.records);

// Export default reducer
export default recordsSlice.reducer;
