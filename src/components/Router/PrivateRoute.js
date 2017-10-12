import React from "react";
import { Redirect, Route } from "react-router-dom";
import requireLoginConnector from "../../connectors/requireLogin";

const PrivateRoute = ({ component: Component, ...rest }) => (
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

export default requireLoginConnector(PrivateRoute);
