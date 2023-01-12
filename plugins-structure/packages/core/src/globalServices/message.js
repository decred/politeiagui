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

export default messageSlice.reducer;
