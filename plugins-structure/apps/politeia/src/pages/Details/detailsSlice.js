import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { recordComments } from "@politeiagui/comments/comments";
import { piSummaries } from "../../pi";

const initialState = {
  status: "idle",
  fullTokenMap: {},
  submissionsLastPos: null,
  error: null,
  downloadStatus: "idle",
  versions: {},
};

export const fetchProposalDetails = createAsyncThunk(
  "details/fetchProposalDetails",
  async (token, { dispatch, rejectWithValue, getState }) => {
    try {
      let fullToken = token;
      // ckeck if token is short
      if (token.length === 7) {
        const detailsRes = await dispatch(records.fetchDetails({ token }));
        const fetchedRecord = detailsRes.payload;
        fullToken = fetchedRecord?.censorshiprecord?.token;
      }
      const state = getState();
      // Load previous information to avoid double requests
      const needsVoteSummaryFetch = !ticketvoteSummaries.selectByToken(
        state,
        fullToken
      );
      const needsCommentsFetch = !recordComments.selectByToken(
        state,
        fullToken
      );
      const needsPiSummariesFetch = !piSummaries.selectByToken(
        state,
        fullToken
      );
      // dispatch if info wasn't loaded
      const responses = await Promise.all([
        token.length > 7 &&
          dispatch(records.fetchDetails({ token: fullToken })),
        needsCommentsFetch &&
          dispatch(recordComments.fetch({ token: fullToken })),
        needsVoteSummaryFetch &&
          dispatch(ticketvoteSummaries.fetch({ tokens: [fullToken] })),
        needsPiSummariesFetch &&
          dispatch(piSummaries.fetch({ tokens: [fullToken] })),
      ]);

      // Handle errors from other thunks.
      const invalidResponse = responses.find((r) => r.error);
      if (invalidResponse) {
        throw invalidResponse.error;
      }

      return fullToken;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (token, { getState }) => {
      const fullToken = selectFullToken(getState(), token);
      return !fullToken || !fullToken.includes(token);
    },
  }
);

export const fetchProposalVersion = createAsyncThunk(
  "details/fetchProposalVersion",
  async ({ token, version }, { getState, rejectWithValue, extra }) => {
    try {
      const res = await extra.fetchRecordDetails(getState(), {
        token,
        version,
      });
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (body) => {
      return body && !!body.version && !!body.token;
    },
  }
);

const detailsSlice = createSlice({
  name: "details",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchProposalDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProposalDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        const token = action.meta.arg;
        state.fullTokenMap[token] = action.payload;
      })
      .addCase(fetchProposalDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchProposalVersion.pending, (state) => {
        state.versionStatus = "loading";
      })
      .addCase(fetchProposalVersion.fulfilled, (state) => {
        state.versionStatus = "succeeded";
      })
      .addCase(fetchProposalVersion.rejected, (state) => {
        state.versionStatus = "failed";
      });
  },
});

export const selectDetailsStatus = (state) => state.details.status;
export const selectDetailsError = (state) => state.details.error;
export const selectFullToken = (state, token) =>
  state.details.fullTokenMap[token];
export const selectRecord = (state, token) => {
  const fullToken = state.details.fullTokenMap[token];
  return records.selectByToken(state, fullToken);
};
export const selectVoteSummary = (state, token) => {
  const fullToken = state.details.fullTokenMap[token];
  return ticketvoteSummaries.selectByToken(state, fullToken);
};
export const selectPiSummary = (state, token) => {
  const fullToken = state.details.fullTokenMap[token];
  return piSummaries.selectByToken(state, fullToken);
};
export const selectComments = (state, token) => {
  const fullToken = state.details.fullTokenMap[token];
  return recordComments.selectByToken(state, fullToken);
};

export default detailsSlice.reducer;
