import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../lib/api";

export const initialState = {
  policy: {},
  status: "idle",
  error: null,
};

export const fetchTicketvotePolicy = createAsyncThunk(
  "ticketvotePolicy/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      return await api.fetchPolicy(getState());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const ticketvotePolicySlice = createSlice({
  name: "ticketvotePolicy",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchTicketvotePolicy.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTicketvotePolicy.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.policy = action.payload;
      })
      .addCase(fetchTicketvotePolicy.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectTicketvotePolicy = (state) => state.ticketvotePolicy.policy;
export const selectTicketvotePolicyRule = (state, rule) =>
  state.ticketvotePolicy.policy && state.ticketvotePolicy.policy[rule];
export const selectTicketvotePolicyStatus = (state) =>
  state.ticketvotePolicy.status;

// Errors
export const selectTicketvotePolicyError = (state) =>
  state.ticketvotePolicy.error;

export default ticketvotePolicySlice.reducer;
