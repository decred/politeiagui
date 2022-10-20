import { createSlice } from "@reduxjs/toolkit";

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

export const services = [
  {
    id: "global/message/set",
    effect: (_, dispatch, { title, body } = {}) => {
      dispatch(setMessage({ title, body }));
    },
  },
  {
    id: "global/message/clear",
    effect: (_, dispatch) => {
      dispatch(clearMessage());
    },
  },
];

export default messageSlice.reducer;
