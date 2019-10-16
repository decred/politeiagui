import * as act from "src/actions";
import { useRedux } from "src/redux";
import * as sel from "src/selectors";

const mapStateToProps = {
  user: sel.user,
  isAdmin: sel.meIsAdmin,
  isApiRequestingEditUser: sel.isApiRequestingEditUser,
  loggedInAsUserId: sel.meUserID,
  editUserResponse: sel.apiEditUserResponse,
  editUserError: sel.editUserError,
  initialValues: sel.getEditUserValues
};
const mapDispatchToProps = {
  onEditUser: act.onEditUserPreferences
};

export function useUserPreferences(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);

  return fromRedux;
}
