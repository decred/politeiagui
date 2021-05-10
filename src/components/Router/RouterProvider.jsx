import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo
} from "react";
import isEqual from "lodash/isEqual";
import { withRouter } from "react-router-dom";

const routerCtx = createContext();

export const useRouter = () => useContext(routerCtx);

const RouterProvider = ({ location, children, ...rest }) => {
  const [pastLocations, setPastLocations] = useState([]);

  useEffect(() => {
    if (!isEqual(pastLocations[0], location)) {
      setPastLocations([location].concat(pastLocations));
    }
  }, [location, pastLocations]);

  const ctxValue = useMemo(
    () => ({ ...rest, location, pastLocations }),
    [rest, location, pastLocations]
  );

  return <routerCtx.Provider value={ctxValue}>{children}</routerCtx.Provider>;
};

export default withRouter(RouterProvider);
