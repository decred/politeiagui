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
  recordsVersions: {},
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

export const fetchRecordVersionDetails = createAsyncThunk(
  "records/fetchVersionDetails",
  async ({ token, version }, { getState, extra, rejectWithValue }) => {
    try {
      return await extra.fetchRecordDetails(getState(), { token, version });
    } catch (error) {
      const message = getRecordsErrorMessage(error.body, error.message);
      return rejectWithValue(message);
    }
  },
  {
    condition: ({ token, version }) =>
      !!token && typeof token === "string" && !!version,
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
        state.records[token].detailsFetched = true;
      })
      .addCase(fetchRecordDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchRecordVersionDetails.pending, (state, action) => {
        const { token, version } = action.meta.arg;
        state.recordsVersions[token] = {
          ...(state.recordsVersions[token] || {}),
          [version]: {
            status: "loading",
          },
        };
      })
      .addCase(fetchRecordVersionDetails.fulfilled, (state, action) => {
        const record = action.payload;
        const { version } = record;
        const { token } = record.censorshiprecord;
        state.recordsVersions[token] = {
          ...(state.recordsVersions[token] || {}),
          [version]: {
            record,
            status: "succeeded",
          },
        };
      })
      .addCase(fetchRecordVersionDetails.rejected, (state, action) => {
        const { token, version } = action.meta.arg;
        state.recordsVersions[token] = {
          ...(state.recordsVersions[token] || {}),
          [version]: {
            error: action.payload,
            status: "failed",
          },
        };
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

export const selectRecordVersionByToken = (state, { version, token }) => {
  const latestRecord = state.records.records[token];
  const latestVersion = latestRecord?.version;
  if (latestVersion === version) {
    return latestRecord;
  }
  // in case proposal version is not latest, get from recordsVersions
  const recordVersions = state.records.recordsVersions[token];
  if (!recordVersions) return;
  return recordVersions[version]?.record;
};

export const selectRecordVersionStatusByToken = (state, { version, token }) => {
  const latestRecord = state.records.records[token];
  const latestVersion = latestRecord?.version;
  if (latestVersion === version) {
    return state.records.status;
  }
  const recordVersions = state.records.recordsVersions[token];
  if (!recordVersions) return;
  return recordVersions[version]?.status;
};

export const selectRecordByShortToken = (state, shortToken) => {
  const allRecords = selectRecords(state);
  const fullToken = selectFullToken(state, shortToken);
  if (fullToken) {
    return allRecords[fullToken];
  }
};

// Export default reducer
export default recordsSlice.reducer;
