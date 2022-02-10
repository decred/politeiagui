import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initialState = {
  policy: {},
  status: "idle",
  error: null,
};

export const fetchRecordsPolicy = createAsyncThunk(
  "recordsPolicy/fetch",
  async (_, { getState, rejectWithValue, extra }) => {
    try {
      return await extra.fetchPolicy(getState());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const recordsPolicySlice = createSlice({
  name: "recordsPolicy",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchRecordsPolicy.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecordsPolicy.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.policy = action.payload;
      })
      .addCase(fetchRecordsPolicy.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectRecordsPolicy = (state) => state.recordsPolicy.policy;
export const selectRecordsPolicyRule = (state, rule) =>
  state.recordsPolicy.policy && state.recordsPolicy.policy[rule];
export const selectRecordsPolicyStatus = (state) => state.recordsPolicy.status;

// Errors
export const selectRecordsPolicyError = (state) => state.recordsPolicy.error;

export default recordsPolicySlice.reducer;
