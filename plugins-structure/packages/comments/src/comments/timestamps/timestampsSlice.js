import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import { validateCommentsTimestampsPageSize } from "../../lib/validation";
import { getCommentsError } from "../../lib/errors";
import chunk from "lodash/chunk";

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
export const fetchAllCommentsTimestamps = createAsyncThunk(
  "commentsTimestamps/fetchAll",
  async ({ token, commentids }, { getState, dispatch }) => {
    const {
      commentsPolicy: {
        policy: { timestampspagesize },
      },
    } = getState();
    const pages = chunk(commentids, timestampspagesize);
    const responses = await Promise.all(
      pages.map((page) =>
        dispatch(fetchCommentsTimestamps({ token, commentids: page }))
      )
    );
    const responseError = responses.find((r) => r.error);
    if (responseError) {
      throw Error(responseError.error);
    }
    return responses
      .map((res) => res.payload.comments)
      .reduce((acc, c) => ({ ...acc, ...c }), {});
  },
  {
    condition: (_, { getState }) => {
      return validateCommentsTimestampsPageSize(getState());
    },
    getPendingMeta: ({ arg }, { getState }) => {
      const {
        commentsPolicy: {
          policy: { timestampspagesize },
        },
      } = getState();
      const total = Math.ceil(arg.commentids.length / timestampspagesize);
      return { total };
    },
  }
);

// Reducer
const commentsTimestampsSlice = createSlice({
  name: "commentsTimestamps",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchCommentsTimestamps.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCommentsTimestamps.fulfilled, (state, action) => {
        const { token } = action.meta.arg;
        if (!state.byToken[token]) {
          state.byToken[token] = {};
        }
        const { comments } = action.payload;
        for (const commentid in comments) {
          if (comments.hasOwnProperty(commentid)) {
            state.byToken[token][commentid] = comments[commentid];
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

// Selectors
export const selectCommentsTimestampsStatus = (state) =>
  state.commentsTimestamps?.status;
export const selectCommentsTimestampsByToken = (state, token) =>
  state.commentsTimestamps?.byToken[token];

// Errors
export const selectCommentsTimestampsError = (state) =>
  state.commentsTimestamps?.error;

export default commentsTimestampsSlice.reducer;
