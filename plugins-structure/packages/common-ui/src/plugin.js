import { pluginSetup } from "@politeiagui/core";
import { themeReducer } from "./layout";
import navigationReducer from "./services/navigation";
// Apply styles once theme is imported.
import "pi-ui/dist/index.css";

// UiPlugin Interface
const UiPlugin = pluginSetup({
  reducers: [
    { key: "uiTheme", reducer: themeReducer },
    { key: "uiNavigation", reducer: navigationReducer },
  ],
  name: "common-ui",
});

export default UiPlugin;
