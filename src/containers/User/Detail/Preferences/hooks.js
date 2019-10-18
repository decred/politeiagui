import * as act from "src/actions";
import { useRedux } from "src/redux";
import * as sel from "src/selectors";

const mapStateToProps = {
  isAdmin: sel.currentUserIsAdmin,
  isApiRequestingEditUser: sel.isApiRequestingEditUser,
  loggedInAsUserId: sel.currentUserID,
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
