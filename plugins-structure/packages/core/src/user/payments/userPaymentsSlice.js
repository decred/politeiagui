import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialPaymentState = {
  data: null,
  status: "idle",
  error: null,
};

const initialState = {
  paywall: initialPaymentState,
  credits: initialPaymentState,
};

/**
 * fetchUserPaywall - Fetches the user paywall data. This data is used to
 * calculate the user's credits balance and the fee to pay for the paywall.
 */
export const fetchUserPaywall = createAsyncThunk(
  "userPayments/fetchPaywall",
  async (_, { rejectWithValue, extra, getState }) => {
    try {
      return await extra.userPaywall(getState());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * fetchUserCredits - Fetches the logged in user credits data.
 */
export const fetchUserCredits = createAsyncThunk(
  "userPayments/fetchCredits",
  async (_, { rejectWithValue, extra, getState }) => {
    try {
      return await extra.userCredits(getState());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const rescanUserPayments = createAsyncThunk(
  "userPayments/rescan",
  async ({ userid }, { getState, rejectWithValue, extra }) => {
    try {
      return await extra.userPaymentsRescan(getState(), { userid });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userPaymentsSlice = createSlice({
  name: "userPayments",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchUserPaywall.pending, (state) => {
        state.paywall.status = "loading";
      })
      .addCase(fetchUserPaywall.fulfilled, (state, action) => {
        state.paywall.status = "succeeded";
        state.paywall.data = action.payload;
      })
      .addCase(fetchUserPaywall.rejected, (state, action) => {
        state.paywall.status = "failed";
        state.paywall.error = action.payload;
      })
      .addCase(fetchUserCredits.pending, (state) => {
        state.credits.status = "loading";
      })
      .addCase(fetchUserCredits.fulfilled, (state, action) => {
        state.credits.status = "succeeded";
        state.credits.data = action.payload;
      })
      .addCase(fetchUserCredits.rejected, (state, action) => {
        state.credits.status = "failed";
        state.credits.error = action.payload;
      })
      .addCase(rescanUserPayments.pending, (state) => {
        state.credits.status = "loading";
      })
      .addCase(rescanUserPayments.fulfilled, (state, action) => {
        state.credits.status = "succeeded";
        if (state.credits.data.unspentcredits) {
          state.credits.data.unspentcredits.push(...action.payload.newcredits);
        } else {
          state.credits.data = { unspentcredits: action.payload.newcredits };
        }
      })
      .addCase(rescanUserPayments.rejected, (state, action) => {
        state.credits.status = "failed";
        state.credits.error = action.payload;
      });
  },
});

// Paywall
export const selectUserPaywall = (state) => state.userPayments.paywall.data;
export const selectUserPaywallStatus = (state) =>
  state.userPayments.paywall.status;
export const selectUserPaywallError = (state) =>
  state.userPayments.paywall.error;

// Credits
export const selectUserCredits = (state) => state.userPayments.credits.data;
export const selectUserCreditsStatus = (state) =>
  state.userPayments.credits.status;
export const selectUserCreditsError = (state) =>
  state.userPayments.credits.error;

export default userPaymentsSlice.reducer;
