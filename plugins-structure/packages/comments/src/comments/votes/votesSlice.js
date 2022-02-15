import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../lib/api";

export const initialState = {
  byUser: {},
  status: "idle",
  error: false,
};

export const fetchCommentsVotes = createAsyncThunk(
  "commentsVotes/fetch",
  async (body, { getState, rejectWithValue }) => {
    try {
      return await api.fetchVotes(getState(), body);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (body) => {
      return body && !!body.token && !!body.userid;
    },
  }
);

// Reducer
const commentsVotesSlice = createSlice({
  name: "commentsVotes",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchCommentsVotes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCommentsVotes.fulfilled, (state, action) => {
        const { token, userid } = action.meta.arg;
        const { votes } = action.payload;
        const formattedVotes = votes.reduce(
          (acc, curr) => ({ ...acc, [curr.commentid]: curr }),
          {}
        );
        if (!state.byUser[userid]) {
          state.byUser[userid] = {};
        }
        state.byUser[userid][token] = formattedVotes;

        state.status = "succeeded";
      })
      .addCase(fetchCommentsVotes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectCommentsVotesStatus = (state) => state.commentsVotes.status;
export const selectUserCommentsVotesByToken = (state, { token, userid }) =>
  state.commentsVotes.byUser[userid] &&
  state.commentsVotes.byUser[userid][token];

// Errors
export const selectCommentsVotesError = (state) => state.commentsVotes.error;

export default commentsVotesSlice.reducer;
