import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import { getTicketvoteStatusCode } from "../../lib/utils";
import { getTicketvoteError } from "../../lib/errors";
import {
  validateTicketvoteStatus,
  validateTicketvoteSummariesPageSize,
} from "../../lib/validation";
import isArray from "lodash/fp/isArray";
import pick from "lodash/fp/pick";
import compose from "lodash/fp/compose";
import values from "lodash/fp/values";
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
      const message = getTicketvoteError(error.body, error.message);
      return rejectWithValue(message);
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
          if (action.payload?.[token]) {
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
  state.ticketvoteSummaries?.status;
export const selectTicketvoteSummariesByRecordToken = (state, token) =>
  state.ticketvoteSummaries?.byToken[token];
export const selectTicketvoteSummaries = (state) =>
  state.ticketvoteSummaries?.byToken;

export const selectTicketvoteSummariesByStatus = (state, status) => {
  if (validateTicketvoteStatus(status)) {
    return state.ticketvoteSummaries
      ? Object.values(state.ticketvoteSummaries.byToken).filter(
          (summary) => summary.status === getTicketvoteStatusCode(status)
        )
      : undefined;
  }
};

export const selectTicketvoteSummariesByTokensBatch = (state, tokens) =>
  compose(values, pick(tokens))(state.commentsCount?.byToken);

export const selectTicketvoteSummariesFetchedTokens = (state, tokens) => {
  if (!tokens)
    return state.ticketvoteSummaries
      ? Object.keys(state.ticketvoteSummaries.byToken)
      : undefined;
  const summariesByTokens = state.ticketvoteSummaries
    ? pick(tokens)(state.ticketvoteSummaries.byToken)
    : undefined;
  return Object.keys(summariesByTokens);
};

// Error
export const selectTicketvoteSummariesError = (state) =>
  state.ticketvoteSummaries?.error;

// Export default reducer
export default ticketvoteSummariesSlice.reducer;
