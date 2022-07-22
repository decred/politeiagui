import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../lib/api";
import { validatePiBillingStatusChangesPageSize } from "../lib/validation";
import last from "lodash/last";

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
  },
  {
    condition: (body, { getState }) =>
      body &&
      !!body.tokens &&
      validatePiBillingStatusChangesPageSize(getState()),
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
export const selectPiBillingLastStatusChangeByToken = (state, token) => {
  const statusChanges = selectPiBillingStatusChangesByToken(state, token);
  return last(statusChanges);
};
export const selectPiBillingStatusChanges = (state) => state.piBilling?.byToken;
export const selectPiBillingStatus = (state) => state.piBilling?.status;

export default piBillingSlice.reducer;
