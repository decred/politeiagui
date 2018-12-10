import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { get, compose } from "lodash/fp";
import { arg } from "../lib/fp";
import * as sel from "../selectors";
import * as act from "../actions";

const userPreferencesConnector = connect(
  sel.selectorMap({
    userId: compose(
      get(["match", "params", "userId"]),
      arg(1)
    ),
    loggedInAsUserId: sel.userid,
    user: sel.user,
    isAdmin: sel.isAdmin,
    isApiRequestingEditUser: sel.isApiRequestingEditUser,
    editUserResponse: sel.apiEditUserResponse,
    editUserError: sel.editUserError,
    initialValues: sel.getEditUserValues
  }),
  {
    onEditUser: act.onEditUserPreferences
  }
);

export default compose(
  userPreferencesConnector,
  reduxForm({
    form: "form/user-preferences"
  })
);
