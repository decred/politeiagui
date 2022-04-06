import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { recordComments } from "@politeiagui/comments/comments";
import { piSummaries } from "../../pi";

const initialState = {
  status: "idle",
  fullToken: null,
  submissionsLastPos: null,
  error: null,
  downloadStatus: "idle",
};

export const fetchProposalDetails = createAsyncThunk(
  "details/fetchProposalDetails",
  async (token, { dispatch, rejectWithValue }) => {
    try {
      let fullToken = token;
      // create responses array so we can handle errors and details from thunks
      // responses.
      const responses = [];

      // If token is short, fetch details first to get the full token, and then
      // dispatch other actions with full token. Otherwise, dispatch all actions
      // simultaneously.
      if (token.length === 7) {
        const detailsRes = await dispatch(records.fetchDetails({ token }));
        const fetchedRecord = detailsRes.payload;
        fullToken = fetchedRecord?.censorshiprecord?.token;
        const [commentsRes, ticketvoteSummariesRes, piSummariesRes] =
          await Promise.all([
            dispatch(recordComments.fetch({ token: fullToken })),
            dispatch(ticketvoteSummaries.fetch({ tokens: [fullToken] })),
            dispatch(piSummaries.fetch({ tokens: [fullToken] })),
          ]);
        responses.push(
          detailsRes,
          commentsRes,
          ticketvoteSummariesRes,
          piSummariesRes
        );
      } else {
        const res = await Promise.all([
          dispatch(records.fetchDetails({ token: fullToken })),
          dispatch(recordComments.fetch({ token: fullToken })),
          dispatch(ticketvoteSummaries.fetch({ tokens: [fullToken] })),
          dispatch(piSummaries.fetch({ tokens: [fullToken] })),
        ]);
        responses.push(...res);
      }

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
      const fullToken = selectFullToken(getState());
      return !fullToken || !fullToken.includes(token);
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
        state.fullToken = action.payload;
      })
      .addCase(fetchProposalDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectDetailsStatus = (state) => state.details.status;
export const selectDetailsError = (state) => state.details.error;
export const selectFullToken = (state) => state.details.fullToken;
export const selectRecord = (state) => {
  const fullToken = state.details.fullToken;
  return records.selectByToken(state, fullToken);
};
export const selectVoteSummary = (state) => {
  const fullToken = state.details.fullToken;
  return ticketvoteSummaries.selectByToken(state, fullToken);
};
export const selectPiSummary = (state) => {
  const fullToken = state.details.fullToken;
  return piSummaries.selectByToken(state, fullToken);
};
export const selectComments = (state) => {
  const fullToken = state.details.fullToken;
  return recordComments.selectByToken(state, fullToken);
};

export default detailsSlice.reducer;
