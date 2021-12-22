import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../lib/api";

const initialState = {
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
    condition: (body) => !!body?.token,
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
export const selectCommentsCountStatus = (state) => state.commentsCount.status;
export const selectCommentsCountByToken = (state, token) =>
  state.commentsCount.byToken[token];

export const selectRecordCommentsCountById = (state, { token, id }) =>
  state.commentsCount.byToken[token] && state.commentsCount.byToken[token][id];

export const selectCommentsCountError = (state) => state.comments.error;

export default commentsCountSlice.reducer;
