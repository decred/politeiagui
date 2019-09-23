import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import RouteWithTitle from "./RouteWithTitle";
import { useLoaderContext } from "src/Appv2/Loader";

const AuthenticatedRoute = ({ history, ...props }) => {
  const { initDone, currentUser } = useLoaderContext();
  useEffect(() => {
    if (initDone && !currentUser) {
      // there is not user logged in
      history.push("/");
    }
  }, [initDone, currentUser, history]);
  return <RouteWithTitle {...props} />;
};

export default withRouter(AuthenticatedRoute);
