import React, { Component } from "react";
import { Redirect, Route, withRouter } from "react-router-dom";
import requireLoginConnector from "../../connectors/requireLogin";

class AuthenticatedRoute extends Component {
  componentDidMount() {
    if (this.props.loggedInAs) {
      return;
    }

    this.props.redirectedFrom(this.props.location.pathname);
  }

  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route {...rest} render={props => (
        rest.loggedInAs ? (
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname: "/user/login",
            state: { from: props.location },
          }} />
        )
      )} />
    );
  }
}

export default requireLoginConnector(withRouter(AuthenticatedRoute));
