import { getURLSearchParams } from "../../router/helpers";
import { createSliceServices } from "../../toolkit/createSliceServices";
import { fetchPolicyIfIdle } from "../utils";
import { userFetchMe, userVerifyEmail } from "./userAuthSlice";

export const { pluginServices, serviceListeners } = createSliceServices({
  name: "userAuth",
  services: {
    loadMe: {
      effect: (_, dispatch, { activeusersession }) => {
        if (activeusersession) {
          dispatch(userFetchMe());
        }
      },
    },
    userPolicyOnLoad: {
      onSetup: async () => {
        await fetchPolicyIfIdle();
      },
    },
    verifyEmailOnLoad: {
      onSetup: async ({ dispatch }) => {
        const { email, verificationtoken, username } = getURLSearchParams();
        if (email && verificationtoken && username) {
          await dispatch(
            userVerifyEmail({ email, username, verificationtoken })
          );
        }
      },
    },
  },
});
