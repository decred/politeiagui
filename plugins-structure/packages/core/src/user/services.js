import { user } from ".";
import { getURLSearchParams } from "../router";
import { createSliceServices } from "../toolkit";

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
