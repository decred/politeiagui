import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import requireLoginConnector from "../../connectors/requireLogin";

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
    if (nextProps.location !== this.props.location) {
      this.checkAuthentication(nextProps);
    }
  }

  checkAuthentication(params) {
    const { location, loggedInAs, history } = params;
    if (!loggedInAs) {
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
