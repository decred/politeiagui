import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../lib/api";

export const initialState = {
  byToken: {},
  status: "idle",
  error: false,
};

export const fetchTicketvoteResults = createAsyncThunk(
  "ticketvoteResults/fetch",
  async ({ token }, { getState, rejectWithValue }) => {
    try {
      return await api.fetchResults(getState(), { token });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (body) => !!body?.token,
  }
);

// Reducer
const ticketvoteResultsSlice = createSlice({
  name: "ticketvoteResults",
  initialState,
  extraReducers(builder) {
    builder
      // Results
      .addCase(fetchTicketvoteResults.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTicketvoteResults.fulfilled, (state, action) => {
        const { token } = action.meta.arg;
        state.byToken[token] = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchTicketvoteResults.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectTicketvoteResultsStatus = (state) =>
  state.ticketvoteResults.status;
export const selectTicketvoteResultsByToken = (state, token) =>
  state.ticketvoteResults.byToken[token];

export const selectTicketvoteResultsError = (state) =>
  state.ticketvoteResults.error;

export default ticketvoteResultsSlice.reducer;
