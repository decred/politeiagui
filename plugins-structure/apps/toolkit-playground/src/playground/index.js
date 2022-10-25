import { pluginSetup } from "@politeiagui/core";
import { createSliceServices } from "@politeiagui/core/toolkit";
import { records } from "@politeiagui/core/records";

export const services = createSliceServices({
  name: "playground/test",
  services: {
    foo: {
      effect: async (state, dispatch, { token }) => {
        console.log("[EFFECT] playground/test/foo", state, dispatch, { token });
        await dispatch(records.fetchDetails({ token }));
      },
      onSetup: () => {
        console.log("[SETUP] playground/test/foo");
      },
    },
    create: {
      onSetup: () => {
        console.log("[SETUP] playground/test/create");
      },
    },
    effectWithoutPrepare: {
      effect: (state, dispatch, payload) => {
        console.log("[EFFECT] playground/test/effectWithoutPrepare", {
          state,
          dispatch,
          payload,
        });
      },
    },
  },
});

export const plugin = pluginSetup({
  name: "playground",
  reducers: [],
  services: services.pluginServices,
});
