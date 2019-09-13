import React, { createContext, useContext, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

const routerCtx = createContext();

export const useRouter = () => useContext(routerCtx);

const RouterProvider = ({ location, history, children, ...rest }) => {
  const [pastLocations, setPastLocations] = useState([]);
  const [previousLocation, setPreviousLocation] = useState(null);

  useEffect(() => {
    setPreviousLocation(pastLocations[0]);
    setPastLocations([location].concat(pastLocations));
  }, [location]);

  return (
    <routerCtx.Provider
      value={{ ...rest, location, history, pastLocations, previousLocation }}
    >
      {children}
    </routerCtx.Provider>
  );
};

export default withRouter(RouterProvider);
