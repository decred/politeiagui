import { Plugin } from "@politeiagui/core";
import { themeReducer } from "@politeiagui/common-ui/layout";

// UiPlugin Interface
const UiPlugin = Plugin({
  reducers: [{ key: "uiTheme", reducer: themeReducer }],
  name: "common-ui",
});

export default UiPlugin;
