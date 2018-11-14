import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as act from "../actions";
import * as sel from "../selectors";

const searchUserConnector = connect(
  sel.selectorMap({
    userSearch: sel.apiUserSearchResponse,
    error: sel.apiUserSearchError,
    isLoading: sel.isApiRequestingUserSearch
  }),
  dispatch =>
    bindActionCreators(
      {
        onSearchUser: act.onSearchUser
      },
      dispatch
    )
);

export default searchUserConnector;
