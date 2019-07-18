import React, { useEffect } from "react";
import { Route, withRouter } from "react-router-dom";
import { useLoaderContext } from "src/Appv2/Loader";

const AuthenticatedRoute = ({ history, ...props }) => {
  const { initDone, currentUser } = useLoaderContext();
  useEffect(() => {
    if (initDone && !currentUser) {
      // there is not user logged in
      history.push("/");
    }
  }, [initDone, currentUser, history]);
  return <Route {...props} />;
};

export default withRouter(AuthenticatedRoute);
