import { listener } from "@politeiagui/core/listeners";
import { saveToLocalStorage } from "@politeiagui/core/storage";
import { DEFAULT_LIGHT_THEME_NAME } from "pi-ui";

export function startThemeListener() {
  listener.startListening({
    type: "uiTheme/setCurrentTheme",
    effect: ({ payload }) => {
      saveToLocalStorage("uiTheme/currentTheme", payload);
    },
  });
  listener.startListening({
    type: "uiTheme/resetTheme",
    effect: () => {
      saveToLocalStorage("uiTheme/currentTheme", DEFAULT_LIGHT_THEME_NAME);
    },
  });
}
