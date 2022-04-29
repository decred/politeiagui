import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import get from "lodash/fp/get";

// Possible status: 'idle' | 'loading' | 'succeeded' | 'failed'
export const initialState = {
  byToken: {},
  status: "idle",
  error: null,
};

export const fetchRecordTimestamps = createAsyncThunk(
  "records/fetchTimestamps",
  async ({ token, version }, { getState, extra, rejectWithValue }) => {
    try {
      return await extra.fetchRecordTimestamps(getState(), { token, version });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: ({ token }) => !!token && typeof token === "string",
  }
);

const recordsTimestampsSlice = createSlice({
  name: "recordsTimestamps",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchRecordTimestamps.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecordTimestamps.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { token, version = 1 } = action.meta.arg;
        state.byToken[token] = {
          ...(state.byToken[token] || {}),
          [version]: action.payload,
        };
      })
      .addCase(fetchRecordTimestamps.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectRecordTimestamps = (state, { token, version }) =>
  get(["recordTimestamps", "byToken", token, version])(state);

export default recordsTimestampsSlice.reducer;
