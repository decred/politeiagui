import { pluginSetup } from "@politeiagui/core";
import { createSliceServices } from "@politeiagui/core/toolkit";
import { records } from "@politeiagui/core/records";
import { recordsPolicy } from "@politeiagui/core/records/policy";

export const services = createSliceServices({
  name: "playground/test",
  services: {
    foo: {
      effect: async (state, dispatch, { token }) => {
        console.log("[EFFECT] playground/test/foo", state, { token });
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
    effectWithoutCustomization: {
      effect: async (state, dispatch, payload) => {
        console.log("[EFFECT] playground/test/effectWithoutCustomization", {
          state,
          payload,
        });
        await dispatch(recordsPolicy.fetch());
      },
    },
  },
});

export const plugin = pluginSetup({
  name: "playground",
  reducers: [],
  services: services.pluginServices,
});
