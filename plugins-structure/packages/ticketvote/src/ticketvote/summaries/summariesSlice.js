import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import {
  getTicketvoteStatusCode,
  getTimestampFromBlocks,
} from "../../lib/utils";
import {
  TICKETVOTE_STATUS_APPROVED,
  TICKETVOTE_STATUS_FINISHED,
  TICKETVOTE_STATUS_REJECTED,
  TICKETVOTE_STATUS_STARTED,
} from "../../lib/constants";
import { getTicketvoteError } from "../../lib/errors";
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

export const selectTicketvoteSummariesByTokensBatch = (state, tokens) => {
  if (!isArray(tokens))
    throw new TypeError("the parameter 'tokens' must be an array");
  const summariesByTokens = state.ticketvoteSummaries
    ? pick(tokens)(state.ticketvoteSummaries.byToken)
    : undefined;
  return summariesByTokens;
};

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

export const selectTicketvoteSummariesStatusChangesByRecordToken = (
  state,
  token
) => {
  const voteSummary = selectTicketvoteSummariesByRecordToken(state, token);
  if (!voteSummary) return;
  const { bestblock, endblockheight, startblockheight, status } = voteSummary;
  if (!endblockheight || !startblockheight) return;
  // TODO: Support both mainnet and testnet block params
  const start = {
    timestamp: getTimestampFromBlocks(startblockheight, bestblock),
    status: TICKETVOTE_STATUS_STARTED,
  };
  const end = {
    timestamp: getTimestampFromBlocks(endblockheight, bestblock),
    status:
      status === TICKETVOTE_STATUS_APPROVED ||
      status === TICKETVOTE_STATUS_REJECTED
        ? status
        : TICKETVOTE_STATUS_FINISHED,
  };
  return [start, end];
};

// Error
export const selectTicketvoteSummariesError = (state) =>
  state.ticketvoteSummaries?.error;

// Export default reducer
export default ticketvoteSummariesSlice.reducer;
