import { createSliceServices } from "../../toolkit/createSliceServices";
import { fetchPolicyIfIdle } from "../utils";

export const { pluginServices, serviceListeners } = createSliceServices({
  name: "userAuth",
  services: {
    signup: {
      onSetup: async () => {
        await fetchPolicyIfIdle();
      },
    },
  },
});
