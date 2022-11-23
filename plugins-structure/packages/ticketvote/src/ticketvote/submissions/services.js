import { createSliceServices } from "@politeiagui/core/toolkit";
import { fetchRecordTicketvoteSubmissions } from "./effects";

export const services = [
  {
    id: "ticketvote/submissions",
    effect: fetchRecordTicketvoteSubmissions,
  },
];

export const sliceServices = createSliceServices({
  name: "ticketvoteSubmissions",
  services: {
    fetch: { effect: fetchRecordTicketvoteSubmissions },
  },
});
