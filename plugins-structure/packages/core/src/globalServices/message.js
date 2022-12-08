import { createSlice } from "@reduxjs/toolkit";
import { createSliceServices } from "../toolkit";

const initialState = {
  title: null,
  body: null,
};

const messageSlice = createSlice({
  name: "globalMessage",
  initialState,
  reducers: {
    setMessage: (state, action) => {
      const { title, body } = action.payload;
      if (title) state.title = title;
      if (body) state.body = body;
    },
    clearMessage: () => {
      return initialState;
    },
  },
});

export const { setMessage, clearMessage } = messageSlice.actions;

export const selectMessage = (state) => state.globalMessage;

export const { pluginServices, serviceSetups } = createSliceServices({
  name: "globalMessage",
  services: {
    set: {
      effect: (_, dispatch, { title, body } = {}) => {
        dispatch(setMessage({ title, body }));
      },
    },
    clear: {
      effect: (_, dispatch) => {
        dispatch(clearMessage());
      },
    },
  },
});

export default messageSlice.reducer;
