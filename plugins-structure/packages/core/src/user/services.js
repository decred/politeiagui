import { user } from ".";
import { getURLSearchParams } from "../router";
import { createSliceServices } from "../toolkit";
import { pluginServices as authServices } from "./auth/services";

// TODO: Move this to a more appropriate place
export const { pluginServices, serviceListeners } = createSliceServices({
  name: "userEmail",
  services: {
    emailVerify: {
      onSetup: ({ dispatch }) => {
        const { verificationtoken } = getURLSearchParams();
        if (verificationtoken) {
          dispatch(user.verifyEmail({ verificationtoken }));
        }
      },
    },
    keyVerify: {
      onSetup: ({ dispatch }) => {
        const { verificationtoken } = getURLSearchParams();
        if (verificationtoken) {
          dispatch(user.verifyKey({ verificationtoken }));
        }
      },
    },
  },
});

export const services = [...authServices, ...pluginServices];
