import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { ticketvotePolicy } from "@politeiagui/ticketvote/policy";

const initialState = {
  status: "idle",
  fullToken: null,
  submissionsLastPos: null,
  error: null,
};

export const fetchProposalDetails = createAsyncThunk(
  "details/fetchProposalDetails",
  async (token, { dispatch, rejectWithValue }) => {
    try {
      let fullToken = token;

      // fetch ticketvote policy required for fetching ticketvote summaries
      await dispatch(ticketvotePolicy.fetch());

      // If token is short, fetch details first to get the full token, and then
      // dispatch other actions with full token. Otherwise, dispatch all actions
      // simultaneously.
      if (token.length === 7) {
        const fetchedRecord = await dispatch(records.fetchDetails({ token }));
        fullToken = fetchedRecord.payload.censorshiprecord.token;
        await Promise.all([
          dispatch(ticketvoteSummaries.fetch({ tokens: [fullToken] })),
        ]);
      } else {
        await Promise.all([
          dispatch(records.fetchDetails({ token: fullToken })),
          dispatch(ticketvoteSummaries.fetch({ tokens: [fullToken] })),
        ]);
      }

      return fullToken;
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
      });
  },
});

export const selectDetailsStatus = (state) => state.details.status;
export const selectFullToken = (state) => state.details.fullToken;

export default detailsSlice.reducer;
