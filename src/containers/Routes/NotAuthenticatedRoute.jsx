import React, { useEffect } from "react";
import { Route, withRouter } from "react-router-dom";
import { useLoaderContext } from "src/Appv2/Loader";

const NotAuthenticatedRoute = ({ history, ...props }) => {
  const { initDone, currentUser } = useLoaderContext();
  useEffect(() => {
    if (initDone && currentUser) {
      // user is logged in so he must not be in this route
      history.push("/");
    }
  }, [initDone, currentUser, history]);
  return <Route {...props} />;
};

export default withRouter(NotAuthenticatedRoute);
