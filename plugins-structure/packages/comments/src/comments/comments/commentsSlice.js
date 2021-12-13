import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../lib/api";

const initialState = {
  byToken: {},
  status: "idle",
  error: false,
};

export const fetchComments = createAsyncThunk(
  "comments/fetch",
  async (body, { rejectWithValue }) => {
    try {
      return await api.fetchComments(body);
    } catch (error) {
      rejectWithValue(error.message);
    }
  },
  {
    condition: (body) => body?.token,
  }
);

// Reducer
const commentsSlice = createSlice({
  name: "comments",
  initialState,
  extraReducers(builder) {
    builder
      // Results
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { token } = action.meta.arg;
        const { comments } = action.payload;
        const commentsById = comments.reduce(
          (acc, c) => ({ ...acc, [c.commentid]: c }),
          {}
        );
        console.log("action payload", commentsById);
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
  state.comments.byToken[token] && state.comments.byToken[token][id];

export const selectCommentsError = (state) => state.comments.error;

export default commentsSlice.reducer;
