import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "./api";
import { validatePiSummariesPageSize } from "./validation";

const byTokenObj = {
  byToken: {},
  status: "idle",
  error: null,
};

export const initialState = {
  summaries: byTokenObj,
  policy: {
    policy: {},
    status: "idle",
    error: null,
  },
};

export const fetchPiSummaries = createAsyncThunk(
  "pi/fetchSummaries",
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

export const fetchPiPolicy = createAsyncThunk(
  "pi/fetchPolicy",
  async (_, { getState, rejectWithValue }) => {
    try {
      return await api.fetchPolicy(getState());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const piSlice = createSlice({
  name: "pi",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchPiSummaries.pending, (state) => {
        state.summaries.status = "loading";
      })
      .addCase(fetchPiSummaries.fulfilled, (state, action) => {
        state.summaries.status = "succeeded";
        state.summaries.byToken = {
          ...state.summaries.byToken,
          ...action.payload.summaries,
        };
      })
      .addCase(fetchPiSummaries.rejected, (state, action) => {
        state.summaries.status = "failed";
        state.summaries.error = action.payload;
      })
      .addCase(fetchPiPolicy.pending, (state) => {
        state.policy.status = "loading";
      })
      .addCase(fetchPiPolicy.fulfilled, (state, action) => {
        state.policy.status = "succeeded";
        state.policy.policy = action.payload;
      })
      .addCase(fetchPiPolicy.rejected, (state, action) => {
        state.policy.status = "failed";
        state.policy.error = action.payload;
      });
  },
});

export const selectPiSummariesByToken = (state, token) =>
  state.pi.summaries.byToken[token];
export const selectPiSummaries = (state) => state.pi.summaries.byToken;
export const selectPiPolicy = (state) => state.pi.policy.policy;

export default piSlice.reducer;
