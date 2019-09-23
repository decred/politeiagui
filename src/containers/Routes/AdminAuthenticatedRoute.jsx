import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import RouteWithTitle from "./RouteWithTitle";
import { useLoaderContext } from "src/Appv2/Loader";

const AdminAuthenticatedRoute = ({ history, ...props }) => {
  const { initDone, currentUser } = useLoaderContext();
  useEffect(() => {
    if (initDone && (!currentUser || !currentUser.isadmin)) {
      // there is not user logged in or user is not an admin
      history.push("/");
    }
  }, [initDone, currentUser, history]);
  return initDone && !!currentUser && <RouteWithTitle {...props} />;
};

export default withRouter(AdminAuthenticatedRoute);
