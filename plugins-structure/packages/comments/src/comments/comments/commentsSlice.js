import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../lib/api";

export const initialState = {
  byToken: {},
  status: "idle",
  error: false,
};

export const fetchComments = createAsyncThunk(
  "comments/fetch",
  async ({ token }, { getState, rejectWithValue }) => {
    try {
      return await api.fetchComments(getState(), { token });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (body) => !!body?.token,
  }
);

// Reducer
const commentsSlice = createSlice({
  name: "comments",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { token } = action.meta.arg;
        const comments = action.payload;
        const commentsById = comments.reduce(
          (acc, c) => ({ ...acc, [c.commentid]: c }),
          {}
        );
        state.byToken[token] = commentsById;
        state.status = "succeeded";
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectCommentsStatus = (state) => state.comments.status;
export const selectCommentsByToken = (state, token) =>
  state.comments.byToken[token];

export const selectRecordCommentsById = (state, { token, id }) =>
  state.comments.byToken?.[token][id];

export const selectCommentsError = (state) => state.comments.error;

export default commentsSlice.reducer;
