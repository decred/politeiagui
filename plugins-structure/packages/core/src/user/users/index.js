import {
  fetchUserDetails,
  selectUserById,
  selectUsersError,
  selectUsersStatus,
} from "./usersSlice";

export const users = {
  fetchDetails: fetchUserDetails,
  selectById: selectUserById,
  selectError: selectUsersError,
  selectStatus: selectUsersStatus,
};
