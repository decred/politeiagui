import { user } from ".";
import { getURLSearchParams } from "../router";
import { store } from "../storeSetup";
import { createSliceServices } from "../toolkit";

// TODO: remove `serviceSetups` alias once #2881 gets in
export const { pluginServices, serviceSetups: serviceListeners } =
  createSliceServices({
    name: "userEmail",
    services: {
      emailVerify: {
        onSetup: () => {
          const { verificationtoken } = getURLSearchParams();
          if (verificationtoken) {
            store.dispatch(user.verifyEmail({ verificationtoken }));
          }
        },
      },
      keyVerify: {
        onSetup: () => {
          const { verificationtoken } = getURLSearchParams();
          if (verificationtoken) {
            store.dispatch(user.verifyKey({ verificationtoken }));
          }
        },
      },
    },
  });
