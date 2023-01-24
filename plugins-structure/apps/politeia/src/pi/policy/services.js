import { createSliceServices } from "@politeiagui/core/toolkit";
import { fetchPolicyIfIdle } from "../utils";

export const { pluginServices, serviceListeners } = createSliceServices({
  name: "piPolicy",
  services: {
    fetch: {
      onSetup: async () => {
        await fetchPolicyIfIdle();
      },
    },
  },
});
