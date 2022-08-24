import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import { validateCommentsTimestampsPageSize } from "../../lib/validation";
import { getCommentsError } from "../../lib/errors";

export const initialState = {
  byToken: {},
  status: "idle",
  error: false,
};

export const fetchCommentsTimestamps = createAsyncThunk(
  "commentsTimestamps/fetch",
  async ({ token, commentids }, { getState, rejectWithValue }) => {
    try {
      return await api.fetchTimestamps(getState(), { token, commentids });
    } catch (error) {
      const message = getCommentsError(error.body, error.message);
      return rejectWithValue(message);
    }
  },
  {
    condition: (body, { getState }) => {
      const hasToken = body && body.token;
      const hasValidCommentIds =
        body && (!body.commentids || body.commentids.length > 0);
      return (
        !!hasToken &&
        !!hasValidCommentIds &&
        validateCommentsTimestampsPageSize(getState())
      );
    },
  }
);

// Reducer
const commentsTimestampsSlice = createSlice({
  name: "commentsTimestamps",
  initialState,
  reducers: {
    setFetchDone(state, action) {
      const { commentids, token } = action.payload;

      const isDone =
        state.byToken[token] &&
        (state.byToken[token].isDone ||
          Object.keys(state.byToken[token].timestamps).length ===
            commentids.length);

      state.byToken[token].isDone = isDone;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCommentsTimestamps.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCommentsTimestamps.fulfilled, (state, action) => {
        const { token } = action.meta.arg;
        if (!state.byToken[token]) {
          state.byToken[token] = {
            timestamps: {},
          };
        }
        const { comments } = action.payload;
        for (const commentid in comments) {
          if (comments.hasOwnProperty(commentid)) {
            state.byToken[token].timestamps[commentid] = comments[commentid];
          }
        }
        state.status = "succeeded";
      })
      .addCase(fetchCommentsTimestamps.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setFetchDone } = commentsTimestampsSlice.actions;

// Selectors
export const selectCommentsTimestampsStatus = (state) =>
  state.commentsTimestamps?.status;
export const selectCommentsTimestampsByToken = (state, token) =>
  state.commentsTimestamps?.byToken[token] &&
  state.commentsTimestamps?.byToken[token].timestamps;

export const selectCommentsTimestampsIsDoneByToken = (state, token) =>
  state.commentsTimestamps?.byToken[token] &&
  state.commentsTimestamps?.byToken[token].isDone;

// Errors
export const selectCommentsTimestampsError = (state) =>
  state.commentsTimestamps?.error;

export default commentsTimestampsSlice.reducer;
