import { createSliceServices } from "../../toolkit/createSliceServices";
import { selectCurrentUser } from "../auth/userAuthSlice";
import {
  fetchUserCredits,
  fetchUserPaywall,
  selectUserCreditsStatus,
  selectUserPaywallStatus,
} from "./userPaymentsSlice";

export const { pluginServices, serviceListeners } = createSliceServices({
  name: "userPayments",
  services: {
    fetchPaywallOnLoad: {
      onSetup: async ({ dispatch, getState }) => {
        const status = selectUserPaywallStatus(getState());
        if (status === "idle") {
          await dispatch(fetchUserPaywall());
        }
      },
    },
    credits: {
      effect: async (state, dispatch) => {
        const creditsStatus = selectUserCreditsStatus(state);
        if (creditsStatus === "idle") {
          await dispatch(fetchUserCredits());
        }
      },
    },
    creditsOwnerOnLoad: {
      onSetup: async ({ dispatch, getState, params }) => {
        const state = getState();
        const creditsStatus = selectUserCreditsStatus(state);
        const currentUser = selectCurrentUser(state);
        const isOwner = currentUser && currentUser.userid === params.userid;
        if (creditsStatus === "idle" && isOwner) {
          await dispatch(fetchUserCredits());
        }
      },
    },
  },
});
