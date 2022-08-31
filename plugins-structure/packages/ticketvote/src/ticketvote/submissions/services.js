import { fetchRecordTicketvoteSubmissions } from "./effects";

export const services = [
  {
    id: "ticketvote/submissions",
    effect: fetchRecordTicketvoteSubmissions,
  },
];
