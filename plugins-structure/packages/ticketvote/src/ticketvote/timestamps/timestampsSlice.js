import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import { validateTicketvoteTimestampsPageSize } from "../../lib/validation";

export const initialState = {
  byToken: {},
  status: "idle",
  error: false,
};

export const fetchTicketvoteTimestamps = createAsyncThunk(
  "ticketvoteTimestamps/fetch",
  async ({ token, votespage }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await api.fetchTimestamps(state, { token, votespage });
      const timestampsPageSize =
        getState().ticketvotePolicy.policy.timestampspagesize;
      return { ...response, timestampsPageSize };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (body, { getState }) => {
      const hasToken = body && body.token;
      const hasValidVotespage = body && (!body.votespage || body.votespage > 0);
      return (
        !!hasToken &&
        !!hasValidVotespage &&
        validateTicketvoteTimestampsPageSize(getState())
      );
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
      .addCase(fetchTicketvoteTimestamps.fulfilled, (state, action) => {
        const { token } = action.meta.arg;
        const { timestampsPageSize, ...timestamps } = action.payload;
        state.byToken[token] = timestamps;
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
  state.ticketvoteTimestamps.status;
export const selectTicketvoteTimestampsByToken = (state, token) =>
  state.ticketvoteTimestamps.byToken[token];

// Errors
export const selectTicketvoteTimestampsError = (state) =>
  state.ticketvoteTimestamps.error;

export default ticketvoteTimestampsSlice.reducer;
