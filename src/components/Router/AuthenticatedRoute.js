import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import requireLoginConnector from "../../connectors/requireLogin";
import { loadStateLocalStorage } from "../../lib/local_storage";

class AuthenticatedRoute extends Component {
  constructor(props) {
    super(props);
    this.checkAuthentication(props);
  }

  componentDidUpdate(prevProps) {
    if (
      !this.props.loggedInAsEmail ||
      this.props.location !== prevProps.location
    ) {
      this.checkAuthentication(this.props);
    }
  }

  checkAuthentication(params) {
    const {
      location,
      loggedInAsEmail,
      history,
      apiMeResponse,
      apiLoginResponse
    } = params;
    const dataHasBeenFetched = apiMeResponse || apiLoginResponse;
    const stateFromLocalStorage = loadStateLocalStorage();

    // need to check if the user is logged in either by the API response or by the
    // localstorage data. The localstorage check handles the case where the user has logged in
    // another tab and the current tab hasn't fetched the user authenticated data from the api yet
    const validUserLoginFromApi = dataHasBeenFetched && loggedInAsEmail;
    const validUserLoginFromLocalStorage =
      stateFromLocalStorage &&
      stateFromLocalStorage.api &&
      stateFromLocalStorage.api.me &&
      stateFromLocalStorage.api.me.response;

    if (validUserLoginFromApi || validUserLoginFromLocalStorage) {
      return true;
    } else {
      this.props.redirectedFrom(this.props.location.pathname);
      history.replace({
        pathname: "/user/login",
        state: { from: location }
      });
    }
  }

  render() {
    const { component: Component, ...rest } = this.props;
    return <Route {...rest} render={props => <Component {...props} />} />;
  }
}

export default requireLoginConnector(withRouter(AuthenticatedRoute));
