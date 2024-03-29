import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import { getTicketvoteError } from "../../lib/errors";
import { validateTicketvoteTimestampsPageSize } from "../../lib/validation";
import range from "lodash/range";
import chunk from "lodash/chunk";

const REQUESTS_BATCH_AMOUNT = 5;

export const initialState = {
  status: "idle",
  error: false,
};

export const fetchTicketvoteTimestamps = createAsyncThunk(
  "ticketvoteTimestamps/fetch",
  async ({ token, votesPage }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      return await api.fetchTimestamps(state, {
        token,
        votespage: votesPage,
      });
    } catch (error) {
      const message = getTicketvoteError(error.body, error.message);
      return rejectWithValue(message);
    }
  },
  {
    condition: (body, { getState }) => {
      const hasToken = body && body.token;
      return !!hasToken && validateTicketvoteTimestampsPageSize(getState());
    },
  }
);

export const fetchAllTicketvoteTimestamps = createAsyncThunk(
  "ticketvoteTimestamps/fetchAll",
  async ({ votesCount, token }, { getState, dispatch, rejectWithValue }) => {
    const {
      ticketvotePolicy: {
        policy: { timestampspagesize },
      },
    } = getState();
    const pages = range(0, Math.ceil(votesCount / timestampspagesize) + 1);
    const batches = chunk(pages, REQUESTS_BATCH_AMOUNT);

    let responses = [];

    for (const pages of batches) {
      const pageResponses = await Promise.all(
        pages.map((page) =>
          dispatch(fetchTicketvoteTimestamps({ token, votesPage: page }))
        )
      );
      const responseError = pageResponses.find((r) => r.error);
      if (responseError) {
        return rejectWithValue(responseError.payload);
      }
      responses = [...responses, ...pageResponses];
    }

    return responses
      .map((res) => res.payload)
      .reduce(
        (acc, t) => ({
          details: { ...(acc.details || {}), ...(t.details || {}) },
          auths: [...(acc.auths || []), ...(t.auths || [])],
          votes: [...(acc.votes || []), ...(t.votes || [])],
        }),
        {}
      );
  },
  {
    condition: (_, { getState }) =>
      validateTicketvoteTimestampsPageSize(getState()),
    getPendingMeta: ({ arg }, { getState }) => {
      const {
        ticketvotePolicy: {
          policy: { timestampspagesize },
        },
      } = getState();
      // fetch timestamps for N votes batch + 1 for auths and details
      const total = Math.ceil(arg.votesCount / timestampspagesize) + 1;
      return { total };
    },
  }
);

// Reducer
const ticketvoteTimestampsSlice = createSlice({
  name: "ticketvoteTimestamps",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchTicketvoteTimestamps.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTicketvoteTimestamps.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(fetchTicketvoteTimestamps.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectTicketvoteTimestampsStatus = (state) =>
  state.ticketvoteTimestamps?.status;

// Errors
export const selectTicketvoteTimestampsError = (state) =>
  state.ticketvoteTimestamps?.error;

export default ticketvoteTimestampsSlice.reducer;
