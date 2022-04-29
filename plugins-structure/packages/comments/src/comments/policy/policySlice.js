import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import { getCommentsError } from "../../lib/errors";

export const initialState = {
  policy: {},
  status: "idle",
  error: null,
};

export const fetchCommentsPolicy = createAsyncThunk(
  "commentsPolicy/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      return await api.fetchPolicy(getState());
    } catch (error) {
      const message = getCommentsError(error.body, error.message);
      return rejectWithValue(message);
    }
  }
);

const commentsPolicySlice = createSlice({
  name: "commentsPolicy",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchCommentsPolicy.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCommentsPolicy.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.policy = action.payload;
      })
      .addCase(fetchCommentsPolicy.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectCommentsPolicy = (state) => state.commentsPolicy.policy;
export const selectCommentsPolicyRule = (state, rule) =>
  state.commentsPolicy.policy && state.commentsPolicy.policy[rule];
export const selectCommentsPolicyStatus = (state) =>
  state.commentsPolicy.status;

// Errors
export const selectCommentsPolicyError = (state) => state.commentsPolicy.error;

export default commentsPolicySlice.reducer;
