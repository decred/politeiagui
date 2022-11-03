// createSlice is the main API function to define redux logic
// createAsyncThunk gnerate thunks that automatically dispatch
// start/success/failure actions
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "./errors";

// Possible status: 'idle' | 'loading' | 'succeeded' | 'failed'
// Possible error types: string | null
export const initialState = {
  api: {},
  csrf: "",
  status: "idle",
  error: null,
};

// Thunks
export const fetchApi = createAsyncThunk(
  "api/fetch",
  async (_, { extra, rejectWithValue }) => {
    try {
      return await extra.fetchApi();
    } catch (error) {
      const message = getApiErrorMessage(error.body, error.message);
      throw rejectWithValue(message);
    }
  }
);

// Reducer
const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchApi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchApi.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Assign api return to the state
        state.api = action.payload.api;
        // Assign csrf return to the state
        state.csrf = action.payload.csrf;
      })
      .addCase(fetchApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectApi = (state) => state.api.api;
export const selectApiStatus = (state) => state.api.status;
export const selectApiError = (state) => state.api.error;

// Export default reducer
export default apiSlice.reducer;
