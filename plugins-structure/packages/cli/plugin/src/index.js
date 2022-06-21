import { pluginSetup, store } from "@politeiagui/core";
import { createSlice } from "@reduxjs/toolkit";

const pluginSlice = createSlice({
  initialState: {
    data: null,
  },
  name: "__PLUGIN_NAME__", // Rename this to whatever you want
  reducers: {
    set(state, action) {
      state.data = action.payload;
    },
    reset(state) {
      state.data = null;
    },
  },
});

const { set, reset } = pluginSlice.actions;

const initializers = [
  {
    id: "__PLUGIN_NAME__/setname",
    action: () => store.dispatch(set("__PLUGIN_NAME__")),
  },
  { id: "__PLUGIN_NAME__/reset", action: () => store.dispatch(reset()) },
];

const MyPlugin = pluginSetup({
  initializers,
  reducers: [{ key: "__PLUGIN_NAME__", reducer: pluginSlice.reducer }],
  name: "__PLUGIN_NAME__",
});

export default MyPlugin;
