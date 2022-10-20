import { pluginSetup } from "@politeiagui/core";
import { themeReducer } from "./layout";
// Apply styles once theme is imported.
import "pi-ui/dist/index.css";

// UiPlugin Interface
const UiPlugin = pluginSetup({
  reducers: [{ key: "uiTheme", reducer: themeReducer }],
  name: "common-ui",
});

export default UiPlugin;
