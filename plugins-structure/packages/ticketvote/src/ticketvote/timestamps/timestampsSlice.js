import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import { getTicketvoteError } from "../../lib/errors";
import { validateTicketvoteTimestampsPageSize } from "../../lib/validation";

export const initialState = {
  byToken: {},
  status: "idle",
  error: false,
};

export const fetchTicketvoteTimestamps = createAsyncThunk(
  "ticketvoteTimestamps/fetch",
  async ({ token, votesPage }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await api.fetchTimestamps(state, {
        token,
        votespage: votesPage,
      });
      const timestampsPageSize =
        state.ticketvotePolicy.policy.timestampspagesize;
      return { ...response, timestampsPageSize };
    } catch (error) {
      const message = getTicketvoteError(error.body, error.message);
      return rejectWithValue(message);
    }
  },
  {
    condition: (body, { getState }) => {
      const hasToken = body && body.token;
      if (!hasToken || !body) return false;
      const state = getState();
      const currentData = state.ticketvoteTimestamps.byToken[body.token];
      const hasAuthsAndDetails =
        currentData && currentData.auths && currentData.details;
      const isFetchingVotes = body.votesPage > 0 && hasAuthsAndDetails;
      const hasValidVotesPage = !body.votesPage || isFetchingVotes;
      if (body.votesPage > 0 && !hasAuthsAndDetails) {
        const err = Error(
          "Timestamps votes fetch is only allowed if auths and details were loaded"
        );
        console.error(err);
        throw err;
      }
      return !!hasValidVotesPage && validateTicketvoteTimestampsPageSize(state);
    },
  }
);

export const fetchTicketvoteTimestampsFirstPage = createAsyncThunk(
  "ticketvoteTimestamps/fetchFirstPage",
  async ({ token }, { dispatch }) => {
    await dispatch(fetchTicketvoteTimestamps({ token }));
    await dispatch(fetchTicketvoteTimestamps({ token, votesPage: 1 }));
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
      .addCase(fetchTicketvoteTimestamps.fulfilled, (state, action) => {
        const { token, votesPage } = action.meta.arg;
        const { timestampsPageSize, ...timestamps } = action.payload;
        if (votesPage === undefined) {
          state.byToken[token] = timestamps;
          state.status = "succeeded/needsVotes";
        } else if (timestamps.votes.length === timestampsPageSize) {
          state.status = "succeeded/hasMore";
        } else {
          state.status = "succeeded/isDone";
        }
        if (votesPage && timestamps.votes) {
          state.byToken[token].votes = [
            ...(state.byToken[token].votes || []),
            ...timestamps.votes,
          ];
        }
      })
      .addCase(fetchTicketvoteTimestamps.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectTicketvoteTimestampsStatus = (state) =>
  state.ticketvoteTimestamps.status;
export const selectTicketvoteTimestampsByToken = (state, token) =>
  state.ticketvoteTimestamps.byToken[token];

// Errors
export const selectTicketvoteTimestampsError = (state) =>
  state.ticketvoteTimestamps.error;

export default ticketvoteTimestampsSlice.reducer;
