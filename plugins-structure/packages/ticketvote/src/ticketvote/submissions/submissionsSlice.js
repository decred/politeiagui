import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../lib/api";

export const initialState = {
  byToken: {},
  status: "idle",
  error: null,
};

// Thunks
export const fetchTicketvoteSubmissions = createAsyncThunk(
  "ticketvoteSubmissions/fetch",
  async ({ token }, { getState, rejectWithValue }) => {
    try {
      return await api.fetchSubmissions(getState(), { token });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (body) => !!body?.token,
  }
);

// Reducer
const ticketvoteSubmissionsSlice = createSlice({
  name: "ticketvoteSubmissions",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchTicketvoteSubmissions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTicketvoteSubmissions.fulfilled, (state, action) => {
        const { token } = action.meta.arg;
        state.byToken[token] = action.payload.submissions;
        state.status = "succeeded";
      })
      .addCase(fetchTicketvoteSubmissions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectTicketvoteSubmissionsStatus = (state) =>
  state.ticketvoteSubmissions.status;
export const selectTicketvoteSubmissionsByToken = (state, token) =>
  state.ticketvoteSubmissions.byToken[token];
export const selectTicketvoteSubmissions = (state) =>
  state.ticketvoteSubmissions.byToken;

export const selectTicketvoteSubmissionsError = (state) =>
  state.ticketvoteSubmissions.error;

export default ticketvoteSubmissionsSlice.reducer;
