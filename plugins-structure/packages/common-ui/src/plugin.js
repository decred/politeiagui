import { Plugin } from "@politeiagui/core";
import { themeReducer } from "@politeiagui/common-ui/layout";
// Apply styles once theme is imported.
import "pi-ui/dist/index.css";

// UiPlugin Interface
const UiPlugin = Plugin({
  reducers: [{ key: "uiTheme", reducer: themeReducer }],
  name: "common-ui",
});

export default UiPlugin;
