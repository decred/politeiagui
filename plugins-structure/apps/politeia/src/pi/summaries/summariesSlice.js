import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../lib/api";
import { validatePiSummariesPageSize } from "../lib/validation";

export const initialState = {
  byToken: {},
  status: "idle",
  error: null,
};

export const fetchPiSummaries = createAsyncThunk(
  "piSummaries/fetch",
  async ({ tokens }, { getState, rejectWithValue }) => {
    try {
      return await api.fetchSummaries(getState(), { tokens });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (body, { getState }) =>
      body && !!body.tokens && validatePiSummariesPageSize(getState()),
  }
);

const piSumamriesSlice = createSlice({
  name: "piSummaries",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchPiSummaries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPiSummaries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.byToken = {
          ...state.byToken,
          ...action.payload.summaries,
        };
      })
      .addCase(fetchPiSummaries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectPiSummariesByToken = (state, token) =>
  state.piSummaries.byToken[token];
export const selectPiSummaries = (state) => state.piSummaries.byToken;

export default piSumamriesSlice.reducer;
