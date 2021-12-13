import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../lib/api";

const initialState = {
  byToken: {},
  status: "idle",
  error: false,
};

export const fetchCommentsCount = createAsyncThunk(
  "comments/fetch",
  async (body, { rejectWithValue }) => {
    try {
      return await api.fetchCount(body);
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
      .addCase(fetchCommentsCount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCommentsCount.fulfilled, (state, action) => {
        const { tokens } = action.meta.arg;
        // state.byToken[token] = ;
        state.status = "succeeded";
      })
      .addCase(fetchCommentsCount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectCommentsCountStatus = (state) => state.comments.status;
export const selectCommentsCountByToken = (state, token) =>
  state.comments.byToken[token];

export const selectRecordCommentsCountById = (state, { token, id }) =>
  state.comments.byToken[token] && state.comments.byToken[token][id];

export const selectCommentsCountError = (state) => state.comments.error;

export default commentsSlice.reducer;
