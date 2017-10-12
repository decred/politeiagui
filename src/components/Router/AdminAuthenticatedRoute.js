import React from "react";
import { Redirect, Route } from "react-router-dom";
import requireLoginConnector from "../../connectors/requireLogin";

const AdminAuthenticatedRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    rest.loggedInAs && rest.isAdmin ? (
      <Component {...props} />
    ) : (
      <Redirect to={{
        pathname: "/",
        state: { from: props.location },
      }} />
    )
  )} />
);

export default requireLoginConnector(AdminAuthenticatedRoute);
