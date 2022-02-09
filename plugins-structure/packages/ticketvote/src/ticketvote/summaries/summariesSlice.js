import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import { getTicketvoteStatusCode } from "../../lib/utils";
import {
  validateTicketvoteStatus,
  validateTicketvoteSummariesPageSize,
} from "../../lib/validation";
import isArray from "lodash/fp/isArray";
import pick from "lodash/fp/pick";
import isEmpty from "lodash/fp/isEmpty";

export const initialState = {
  byToken: {},
  status: "idle",
  error: null,
};

// Thunks
export const fetchTicketvoteSummaries = createAsyncThunk(
  "ticketvoteSummaries/fetch",
  async ({ tokens }, { getState, rejectWithValue }) => {
    try {
      return await api.fetchSummaries(getState(), { tokens });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: ({ tokens }, { getState }) => {
      return (
        isArray(tokens) &&
        !isEmpty(tokens) &&
        validateTicketvoteSummariesPageSize(getState())
      );
    },
  }
);

// Reducer
const ticketvoteSummariesSlice = createSlice({
  name: "ticketvoteSummaries",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTicketvoteSummaries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTicketvoteSummaries.fulfilled, (state, action) => {
        state.status = "succeeded";
        for (const token in action.payload) {
          if (action.payload.hasOwnProperty(token)) {
            state.byToken[token] = action.payload[token];
          }
        }
      })
      .addCase(fetchTicketvoteSummaries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectTicketvoteSummariesStatus = (state) =>
  state.ticketvoteSummaries.status;
export const selectTicketvoteSummariesByRecordToken = (state, token) =>
  state.ticketvoteSummaries.byToken[token];
export const selectTicketvoteSummaries = (state) =>
  state.ticketvoteSummaries.byToken;

export const selectTicketvoteSummariesByStatus = (state, status) => {
  if (validateTicketvoteStatus(status)) {
    return Object.values(state.ticketvoteSummaries.byToken).filter(
      (summary) => summary.status === getTicketvoteStatusCode(status)
    );
  }
};

export const selectTicketvoteSummariesByTokensBatch = (state, tokens) => {
  if (!isArray(tokens))
    throw new TypeError("the parameter 'tokens' must be an array");
  const summariesByTokens = pick(tokens)(state.ticketvoteSummaries.byToken);
  return summariesByTokens;
};

export const selectTicketvoteSummariesFetchedTokens = (state, tokens) => {
  if (!tokens) return Object.keys(state.ticketvoteSummaries.byToken);
  const summariesByTokens = pick(tokens)(state.ticketvoteSummaries.byToken);
  return Object.keys(summariesByTokens);
};

// Error
export const selectTicketvoteSummariesError = (state) =>
  state.ticketvoteSummaries.error;

// Export default reducer
export default ticketvoteSummariesSlice.reducer;
