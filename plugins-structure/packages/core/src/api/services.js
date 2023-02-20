import { createSliceServices } from "../toolkit";
import { fetchApi } from "./apiSlice";

export const { pluginServices, serviceListeners } = createSliceServices({
  name: "api",
  services: {
    refreshApi: {
      effect: async (_, dispatch) => {
        await dispatch(fetchApi());
      },
    },
  },
});
