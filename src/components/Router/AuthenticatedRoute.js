import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import requireLoginConnector from "../../connectors/requireLogin";
import { loadStateLocalStorage } from "../../lib/storage";

class AuthenticatedRoute extends Component {
  componentDidMount() {
    if (this.props.loggedInAs) {
      return;
    }

    this.props.redirectedFrom(this.props.location.pathname);
  }

  componentWillMount() {
    this.checkAuthentication(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loggedInAs || nextProps.location !== this.props.location) {
      this.checkAuthentication(nextProps);
    }
  }

  checkAuthentication(params) {
    const { location, loggedInAs, history } = params;
    const stateFromLocalStorage = loadStateLocalStorage();
    if(loggedInAs || (stateFromLocalStorage
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
