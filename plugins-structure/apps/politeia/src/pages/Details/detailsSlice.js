import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { ticketvotePolicy } from "@politeiagui/ticketvote/policy";

const initialState = {
  status: "idle",
  submissionsLastPos: null,
  error: null,
};

export const fetchProposalDetails = createAsyncThunk(
  "details/fetchProposalDetails",
  async (token, { dispatch, rejectWithValue }) => {
    try {
      // fetch ticketvote policy required for fetching ticketvote summaries
      await dispatch(ticketvotePolicy.fetch());
      return await Promise.all([
        dispatch(records.fetchDetails({ token })),
        dispatch(ticketvoteSummaries.fetch({ tokens: [token] })),
      ]);
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
      .addCase(fetchProposalDetails.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(fetchProposalDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectDetailsStatus = (state) => state.details.status;

export default detailsSlice.reducer;
