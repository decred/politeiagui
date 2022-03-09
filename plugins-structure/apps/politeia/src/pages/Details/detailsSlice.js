import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { ticketvotePolicy } from "@politeiagui/ticketvote/policy";
import { recordsTimestamps } from "@politeiagui/core/records/timestamps";

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

      // fetch ticketvote policy required for fetching ticketvote summaries.
      await dispatch(ticketvotePolicy.fetch());

      // If token is short, fetch details first to get the full token, and then
      // dispatch other actions with full token. Otherwise, dispatch all actions
      // simultaneously.
      if (token.length === 7) {
        const fetchedRecord = await dispatch(records.fetchDetails({ token }));
        fullToken = fetchedRecord.payload.record.censorshiprecord.token;
        const tvSummaries = await Promise.all([
          dispatch(ticketvoteSummaries.fetch({ tokens: [fullToken] })),
        ]);
        responses.push(...[fetchedRecord, tvSummaries]);
      } else {
        const res = await Promise.all([
          dispatch(records.fetchDetails({ token: fullToken })),
          dispatch(ticketvoteSummaries.fetch({ tokens: [fullToken] })),
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
  }
);

export const fetchProposalTimestamps = createAsyncThunk(
  "details/fetchProposalTimestamps",
  async ({ token, version }, { dispatch, rejectWithValue }) => {
    try {
      const timestamps = await dispatch(
        recordsTimestamps.fetch({ token, version })
      );
      return timestamps.payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
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
      })
      .addCase(fetchProposalTimestamps.pending, (state) => {
        state.downloadStatus = "loading";
      })
      .addCase(fetchProposalTimestamps.fulfilled, (state) => {
        state.downloadStatus = "succeeded";
      })
      .addCase(fetchProposalTimestamps.rejected, (state, action) => {
        state.downloadStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const selectDetailsStatus = (state) => state.details.status;
export const selectDetailsError = (state) => state.details.error;
export const selectFullToken = (state) => state.details.fullToken;

export default detailsSlice.reducer;
