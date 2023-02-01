import { fetchUserDetails, selectUserById } from "./usersSlice";
import { createSliceServices } from "../../toolkit/createSliceServices";

export const { pluginServices, serviceListeners } = createSliceServices({
  name: "users",
  services: {
    fetchDetailsOnLoad: {
      onSetup: async ({ params, dispatch, getState }) => {
        const { userid } = params;
        const user = selectUserById(getState(), userid);
        if (!user) {
          await dispatch(fetchUserDetails(userid));
        }
      },
    },
  },
});
