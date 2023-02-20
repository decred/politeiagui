import { createSliceServices } from "../../toolkit/createSliceServices";
import { userAuth } from "../auth";
import { loadKey } from "./userIdentitySlice";

export const { pluginServices, serviceListeners } = createSliceServices({
  name: "userIdentity",
  services: {
    loadCurrentUserKey: {
      onSetup: async ({ dispatch, getState }) => {
        const currentUser = userAuth.selectCurrent(getState());
        if (currentUser) {
          await dispatch(loadKey({ userid: currentUser.userid }));
        }
      },
    },
  },
});
