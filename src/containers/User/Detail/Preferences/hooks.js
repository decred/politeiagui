import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import * as sel from "src/selectors";

export function useUserPreferences() {
  const isAdmin = useSelector(sel.currentUserIsAdmin);
  const isApiRequestingEditUser = useSelector(sel.isApiRequestingEditUser);
  const currentUserID = useSelector(sel.currentUserID);
  const editUserResponse = useSelector(sel.currentUserEdited);
  const editUserError = useSelector(sel.editUserError);
  const initialValues = useSelector(sel.currentUserPreferences);

  const onEditUser = useAction(act.onEditUserPreferences);

  return {
    isAdmin,
    isApiRequestingEditUser,
    currentUserID,
    editUserResponse,
    editUserError,
    initialValues,
    onEditUser
  };
}
