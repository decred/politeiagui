import { pluginSetup } from "@politeiagui/core";
import { themeReducer } from "./layout";
import progressReducer, {
  services as progressServices,
} from "./services/progress";
// Apply styles once theme is imported.
import "pi-ui/dist/index.css";

// UiPlugin Interface
const UiPlugin = pluginSetup({
  reducers: [
    { key: "uiTheme", reducer: themeReducer },
    { key: "uiProgress", reducer: progressReducer },
  ],
  name: "common-ui",
  services: [...progressServices],
});

export default UiPlugin;
