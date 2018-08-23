import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import requireLoginConnector from "../../connectors/requireLogin";
import { loadStateLocalStorage } from "../../lib/local_storage";

class AuthenticatedRoute extends Component {
  componentDidMount() {
    if (this.props.loggedInAsEmail) {
      return;
    }

    this.props.redirectedFrom(this.props.location.pathname);
  }

  componentWillMount() {
    this.checkAuthentication(this.props);
  }

  componentDidUpate(prevProps) {
    if (!this.props.loggedInAsEmail || this.props.location !== prevProps.location) {
      this.checkAuthentication(this.props);
    }
  }

  checkAuthentication(params) {
    const { location, loggedInAsEmail, history } = params;
    const stateFromLocalStorage = loadStateLocalStorage();
    if(loggedInAsEmail || (stateFromLocalStorage
      && stateFromLocalStorage.api
      && stateFromLocalStorage.api.me
      && stateFromLocalStorage.api.me.response)
    ) {
      return true;
    } else {
      history.replace({
        pathname: "/user/login",
        state: { from: location }
      });
    }
  }

  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route {...rest}
        render={props => (
          <Component {...props} />
        )}
      />
    );
  }
}

export default requireLoginConnector(withRouter(AuthenticatedRoute));
