import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import { validateCommentsCountsPageSize } from "../../lib/validation";
import { getCommentsError } from "../../lib/errors";
import pick from "lodash/fp/pick";

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
      const message = getCommentsError(error.body, error.message);
      return rejectWithValue(message);
    }
  },
  {
    condition: (body, { getState }) =>
      !!body?.tokens && validateCommentsCountsPageSize(getState()),
  }
);

// Reducer
const commentsCountSlice = createSlice({
  name: "commentsCount",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchCommentsCount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCommentsCount.fulfilled, (state, action) => {
        for (const token in action.payload) {
          if (action.payload?.[token]) {
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
export const selectCommentsCountStatus = (state) => state.commentsCount?.status;
export const selectCommentsCounts = (state) => state.commentsCount?.byToken;
export const selectCommentsCountsByTokensBatch = (state, tokens) =>
  pick(tokens)(state.commentsCount?.byToken);
export const selectCommentsCountError = (state) => state.commentsCount?.error;

export default commentsCountSlice.reducer;
