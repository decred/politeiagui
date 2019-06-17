import React, { useEffect } from "react";
import { Route, withRouter } from "react-router-dom";
import requireLoginConnector from "src/connectors/requireLogin";

const NotAuthenticatedRoute = ({ loggedInAsEmail, history, ...props }) => {
  useEffect(() => {
    if (loggedInAsEmail) {
      // user is logged in so he must no be in this route
      history.push("/");
    }
  }, [loggedInAsEmail]);

  return <Route {...props} />;
};

export default withRouter(requireLoginConnector(NotAuthenticatedRoute));
