import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  total: 0,
};

const progressSlice = createSlice({
  name: "globalProgress",
  initialState,
  reducers: {
    initProgress: (state, action) => {
      state.total = action.payload || 1;
      state.value = 0;
    },
    updateProgress: (state) => {
      state.value++;
    },
    endProgress: () => {
      return initialState;
    },
  },
});

export const { initProgress, updateProgress, endProgress } =
  progressSlice.actions;

export const selectProgress = (state) => {
  const { total, value } = state.globalProgress || {};
  if (!total || isNaN(total) || !value) return 0;
  return (value / total).toFixed(2);
};

export default progressSlice.reducer;
