import { Plugin, store } from "@politeiagui/core";
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

const pluginRoutes = [
  {
    path: "/__PLUGIN_NAME__/setname",
    fetch: () => store.dispatch(set("__PLUGIN_NAME__")),
  },
  { path: "/__PLUGIN_NAME__/reset", fetch: () => store.dispatch(reset()) },
];

const MyPlugin = Plugin({
  reducers: [{ key: "__PLUGIN_NAME__", reducer: pluginSlice.reducer }],
  routes: pluginRoutes,
  name: "__PLUGIN_NAME__",
});

export default MyPlugin;
