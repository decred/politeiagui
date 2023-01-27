import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "./errors";

export const initialState = {
  policy: {},
  status: "idle",
  error: null,
};

export const fetchApiPolicy = createAsyncThunk(
  "apiPolicy/fetch",
  async (_, { extra, rejectWithValue }) => {
    try {
      return await extra.fetchWWWPolicy();
    } catch (error) {
      const message = getApiErrorMessage(error.body, error.message);
      throw rejectWithValue(message);
    }
  }
);

const apiPolicySlice = createSlice({
  name: "apiPolicy",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchApiPolicy.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchApiPolicy.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.policy = action.payload;
      })
      .addCase(fetchApiPolicy.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectApiPolicy = (state) => state.apiPolicy.policy;
export const selectApiPolicyStatus = (state) => state.apiPolicy.status;
export const selectApiPolicyError = (state) => state.apiPolicy.error;

export default apiPolicySlice.reducer;
