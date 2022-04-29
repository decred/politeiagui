import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api";

export const initialState = {
  policy: {},
  status: "idle",
  error: null,
};

export const fetchPiPolicy = createAsyncThunk(
  "piPolicy/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      return await api.fetchPolicy(getState());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const piPolicySlice = createSlice({
  name: "piPolicy",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchPiPolicy.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPiPolicy.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.policy = action.payload;
      })
      .addCase(fetchPiPolicy.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectPiPolicy = (state) => state.piPolicy.policy;
export const selectPiPolicyStatus = (state) => state.piPolicy.status;

export default piPolicySlice.reducer;
