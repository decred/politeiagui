import { createSliceServices } from "@politeiagui/core/toolkit";
import { fetchRecordTicketvoteSubmissions } from "./effects";

export const { pluginServices, serviceListeners } = createSliceServices({
  name: "ticketvoteSubmissions",
  services: {
    fetch: { effect: fetchRecordTicketvoteSubmissions },
  },
});
