import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: null,
  body: null,
  kind: null,
};

const messageSlice = createSlice({
  name: "globalMessage",
  initialState,
  reducers: {
    setMessage: (state, action) => {
      const { title, body, kind } = action.payload;
      if (title) state.title = title;
      if (body) state.body = body;
      if (kind) state.kind = kind;
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
    effect: (_, dispatch, { title, body, kind } = {}) => {
      dispatch(setMessage({ title, body, kind }));
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
