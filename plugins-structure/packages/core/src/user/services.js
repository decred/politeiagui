import { user } from ".";
import { getURLSearchParams } from "../router";
import { store } from "../storeSetup";
import { createSliceServices } from "../toolkit";

// TODO: remove `serviceSetups` alias once #2881 gets in
export const { pluginServices, serviceSetups: serviceListeners } =
  createSliceServices({
    name: "userEmail",
    services: {
      verify: {
        onSetup: () => {
          const { email, verificationtoken } = getURLSearchParams();
          if (email && verificationtoken) {
            store.dispatch(user.verifyEmail({ email, verificationtoken }));
          }
        },
      },
    },
  });
