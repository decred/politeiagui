import { Plugin, store } from "@politeiagui/core";

export const LogPlugin = Plugin({
  routes: [
    {
      path: "/log/store",
      fetch: () => {
        store.subscribe(() => {
          console.log("[LOGGER PLUGIN]", store.getState());
        });
      },
    },
  ],
  name: "log",
});
