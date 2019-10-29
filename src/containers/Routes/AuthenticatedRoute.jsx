import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import Route from "./Route";
import { useLoaderContext } from "src/containers/Loader";

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
