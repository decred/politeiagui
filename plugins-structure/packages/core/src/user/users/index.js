import {
  fetchUserDetails,
  selectUserById,
  selectUsersError,
  selectUsersStatus,
  userEdit,
  userManage,
} from "./usersSlice";

export const users = {
  fetchDetails: fetchUserDetails,
  selectById: selectUserById,
  selectError: selectUsersError,
  selectStatus: selectUsersStatus,
  manage: userManage,
  edit: userEdit,
};
