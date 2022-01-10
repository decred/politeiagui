import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../lib/api";

export const initialState = {
  byToken: {},
  status: "idle",
  error: false,
};

export const fetchCommentsTimestamps = createAsyncThunk(
  "commentsTimestamps/fetch",
  async (body, { getState, rejectWithValue }) => {
    try {
      return await api.fetchTimestamps(getState(), body);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (body) => {
      const hasToken = body && body.token;
      const hasValidCommentIds =
        body && (!body.commentids || body.commentids.length > 0);
      return !!hasToken && !!hasValidCommentIds;
    },
  }
);

// Reducer
const commentsTimestampsSlice = createSlice({
  name: "commentsTimestamps",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchCommentsTimestamps.pending, (state, action) => {
        const { token } = action.meta.arg;
        if (!state.byToken[token]) {
          state.byToken[token] = {};
        }
        state.status = "loading";
      })
      .addCase(fetchCommentsTimestamps.fulfilled, (state, action) => {
        const { token } = action.meta.arg;
        const pageSize = action.meta.arg.pageSize || 100;
        const { comments } = action.payload;
        const payloadSize = Object.keys(comments).length;
        if (payloadSize === pageSize) {
          state.status = "succeeded/hasMore";
        } else {
          state.status = "succeeded/isDone";
        }
        for (const commentid in comments) {
          if (comments.hasOwnProperty(commentid)) {
            state.byToken[token][commentid] = comments[commentid];
          }
        }
      })
      .addCase(fetchCommentsTimestamps.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectCommentsTimestampsStatus = (state) =>
  state.commentsTimestamps.status;
export const selectCommentsTimestampsByToken = (state, token) =>
  state.commentsTimestamps.byToken[token];

// Errors
export const selectCommentsTimestampsError = (state) =>
  state.commentsTimestamps.error;

export default commentsTimestampsSlice.reducer;
