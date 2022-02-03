import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import { getTicketvoteStatusCode } from "../../lib/utils";
import {
  validateTicketvoteStatus,
  validateTicketvoteSummariesPageSize,
} from "../../lib/validation";
import isArray from "lodash/fp/isArray";
import take from "lodash/fp/take";
import pick from "lodash/fp/pick";
import isEmpty from "lodash/fp/isEmpty";
import without from "lodash/fp/without";
import difference from "lodash/fp/difference";

const initialQueueState = {
  tokens: [],
  status: "idle",
};

export const initialState = {
  byToken: {},
  summariesFetchQueue: initialQueueState,
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

export const fetchTicketvoteSummariesNextPage = createAsyncThunk(
  "ticketvoteSummaries/fetchNextPage",
  async (_, { dispatch, getState }) => {
    const state = getState();
    const pageSize = state.ticketvotePolicy.policy.summariespagesize;
    const queue = state.ticketvoteSummaries.summariesFetchQueue.tokens;
    const nextTokens = take(pageSize, queue);
    return await dispatch(fetchTicketvoteSummaries({ tokens: nextTokens }));
  },
  {
    condition: (_, { getState }) => {
      const queue = getState().ticketvoteSummaries.summariesFetchQueue.tokens;
      return !isEmpty(queue) && validateTicketvoteSummariesPageSize(getState());
    },
  }
);

// Reducer
const ticketvoteSummariesSlice = createSlice({
  name: "ticketvoteSummaries",
  initialState,
  reducers: {
    setFetchQueue(state, action) {
      const { tokens } = action.payload;
      if (!isArray(tokens)) throw TypeError("tokens must be an array");
      const newTokens = difference(tokens)(Object.keys(state.byToken));
      state.summariesFetchQueue.tokens = newTokens;
    },
  },
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
      })
      .addCase(fetchTicketvoteSummariesNextPage.pending, (state) => {
        state.status = "loading";
        state.summariesFetchQueue.status = "loading";
      })
      .addCase(fetchTicketvoteSummariesNextPage.fulfilled, (state, action) => {
        state.status = "succeeded";
        const summariesFetched = action.payload.meta.arg;
        const newSummariesQueue = without(
          summariesFetched.tokens,
          state.summariesFetchQueue.tokens
        );
        state.summariesFetchQueue.tokens = newSummariesQueue;
        if (isEmpty(newSummariesQueue)) {
          state.summariesFetchQueue.status = "succeeded/isDone";
        } else {
          state.summariesFetchQueue.status = "succeeded/hasMore";
        }
      })
      .addCase(fetchTicketvoteSummariesNextPage.rejected, (state, action) => {
        state.status = "failed";
        state.summariesFetchQueue.status = "failed";
        state.error = action.payload;
      });
  },
});

// Actions
export const { setFetchQueue } = ticketvoteSummariesSlice.actions;

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

export const selectTicketvoteSummariesFetchQueue = (state) =>
  state.ticketvoteSummaries.summariesFetchQueue.tokens;
export const selectTicketvoteSummariesFetchQueueStatus = (state) =>
  state.ticketvoteSummaries.summariesFetchQueue.status;

export const selectTicketvoteSummariesByTokensBatch = (state, tokens) => {
  if (!isArray(tokens))
    throw new TypeError("the parameter 'tokens' must be an array");
  const summariesByTokens = pick(tokens)(state.ticketvoteSummaries.byToken);
  return Object.values(summariesByTokens);
};
export const selectTicketvoteSummariesFetchedTokens = (state, tokens) => {
  if (!tokens) return Object.keys(state.ticketvoteSummaries.byToken);
  const summariesByTokens = pick(tokens)(state.ticketvoteSummaries.byToken);
  return Object.keys(summariesByTokens);
};

export const selectHasMoreTicketvoteSummariesToFetch = (state) =>
  state.ticketvoteSummaries.summariesFetchQueue.status === "succeeded/hasMore";

// Error
export const selectTicketvoteSummariesError = (state) =>
  state.ticketvoteSummaries.error;

// Export default reducer
export default ticketvoteSummariesSlice.reducer;
