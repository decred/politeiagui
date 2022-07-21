import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../lib/api";
// TODO: validate billing status changes page size

export const initialState = {
  byToken: {},
  status: "idle",
  error: null,
};

export const fetchBillingStatusChanges = createAsyncThunk(
  "piBilling/fetchStatusChanges",
  async ({ tokens }, { getState, rejectWithValue }) => {
    try {
      return await api.fetchBillingStatusChanges(getState(), { tokens });
    } catch (error) {
      // TODO: user friendly error message
      return rejectWithValue(error.message);
    }
  }
);

const piBillingSlice = createSlice({
  name: "piBilling",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchBillingStatusChanges.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBillingStatusChanges.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.byToken = {
          ...state.byToken,
          ...action.payload.billingstatuschanges,
        };
      })
      .addCase(fetchBillingStatusChanges.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectPiBillingStatusChangesByToken = (state, token) =>
  state.piBilling?.byToken[token];
export const selectPiBillingStatusChanges = (state) => state.piBilling?.byToken;
export const selectPiBillingStatus = (state) => state.piBilling?.status;

export default piBillingSlice.reducer;
