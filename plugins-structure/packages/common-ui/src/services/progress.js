import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  total: 0,
};

const progressSlice = createSlice({
  name: "uiProgress",
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

export const selectUiProgress = (state) => {
  const { total, value } = state.uiProgress;
  if (!total || isNaN(total) || !value) return 0;
  return (value / total).toFixed(2);
};

export const services = [
  {
    id: "ui/progress/init",
    effect: (_, dispatch, payload) => {
      if (!isNaN(payload)) {
        dispatch(initProgress(payload));
      }
    },
  },
  {
    id: "ui/progress/update",
    effect: (_, dispatch) => {
      dispatch(updateProgress());
    },
  },
  {
    id: "ui/progress/end",
    effect: (_, dispatch) => {
      dispatch(endProgress());
    },
  },
];

export default progressSlice.reducer;
