import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import Route from "./Route";
import { useLoaderContext } from "src/containers/Loader";

const AdminAuthenticatedRoute = ({ history, ...props }) => {
  const { initDone, currentUser } = useLoaderContext();
  useEffect(() => {
    if (initDone && (!currentUser || !currentUser.isadmin)) {
      // there is not user logged in or user is not an admin
      history.push("/");
    }
  }, [initDone, currentUser, history]);
  return initDone && !!currentUser && <Route {...props} />;
};

export default withRouter(AdminAuthenticatedRoute);
