import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../lib/api";
import { getTicketvoteError } from "../../lib/errors";

export const initialState = {
  byToken: {},
  status: "idle",
  error: null,
};

export const fetchTicketvoteDetails = createAsyncThunk(
  "ticketvoteDetails/fetch",
  async ({ token }, { getState, rejectWithValue }) => {
    try {
      return await api.fetchDetails(getState(), { token });
    } catch (error) {
      const message = getTicketvoteError(error.body, error.message);
      return rejectWithValue(message);
    }
  },
  {
    condition: (body) => !!body?.token,
  }
);

// Reducer
const ticketvoteDetailsSlice = createSlice({
  name: "ticketvoteDetails",
  initialState,
  extraReducers(builder) {
    builder
      // Details
      .addCase(fetchTicketvoteDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTicketvoteDetails.fulfilled, (state, action) => {
        const { token } = action.meta.arg;
        state.byToken[token] = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchTicketvoteDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectTicketvoteDetailsStatus = (state) =>
  state.ticketvoteDetails?.status;
export const selectTicketvoteDetailsByToken = (state, token) =>
  state.ticketvoteDetails?.byToken[token];

// Errors
export const selectTicketvoteDetailsError = (state) =>
  state.ticketvoteDetails?.error;

export default ticketvoteDetailsSlice.reducer;
