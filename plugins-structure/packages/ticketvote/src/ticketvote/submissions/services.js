import { createSliceServices } from "@politeiagui/core/toolkit";
import { fetchRecordTicketvoteSubmissions } from "./effects";

export const { pluginServices, serviceSetups } = createSliceServices({
  name: "ticketvoteSubmissions",
  services: {
    fetch: { effect: fetchRecordTicketvoteSubmissions },
  },
});
