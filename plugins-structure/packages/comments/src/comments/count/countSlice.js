import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../lib/api";

export const initialState = {
  byToken: {},
  status: "idle",
  error: false,
};

export const fetchCommentsCount = createAsyncThunk(
  "commentsCount/fetch",
  async (body, { getState, rejectWithValue }) => {
    try {
      return await api.fetchCount(getState(), body);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (body) => !!body?.tokens,
  }
);

// Reducer
const commentsCountSlice = createSlice({
  name: "commentsCount",
  initialState,
  extraReducers(builder) {
    builder
      // Results
      .addCase(fetchCommentsCount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCommentsCount.fulfilled, (state, action) => {
        // console.log("tokens", tokens, action.payload);
        for (const token in action.payload) {
          if (action.payload.hasOwnProperty(token)) {
            state.byToken[token] = action.payload[token];
          }
        }
        state.status = "succeeded";
      })
      .addCase(fetchCommentsCount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectCommentsCountStatus = (state) => state.commentsCount.status;
export const selectCommentsCounts = (state) => state.commentsCount.byToken;

export const selectCommentsCountError = (state) => state.commentsCount.error;

export default commentsCountSlice.reducer;
