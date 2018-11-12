import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";

const changeUsernameConnector = connect(
  sel.selectorMap({
    policy: sel.policy,
    isApiRequestingChangeUsername: or(
      sel.isApiRequestingInit,
      sel.isApiRequestingChangeUsername
    ),
    changeUsernameResponse: sel.apiChangeUsernameResponse
  }),
  {
    onChangeUsername: act.onSaveChangeUsername,
    onFetchData: act.onGetPolicy
  }
);

export default changeUsernameConnector;
