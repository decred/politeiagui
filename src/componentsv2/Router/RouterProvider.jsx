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

/**
 * Watch for route changes and triggers the callbackFn when
 * route changes.
 *
 * @param {Boolean} active - if hook is active or not
 * @param {Function} callbackFn - function that will be
 * triggered when route changes
 */
export const useRouteChanges = (active, callbackFn) => {
  const { location: { pathname } } = useRouter();
  const callback = useMemo(() =>
    active && callbackFn ? callbackFn : () => {}
  , [callbackFn, active]);

  useEffect(() => {
    return () => {
      callback();
    };
  }, [pathname, callback]);
};

const RouterProvider = ({ location, children, ...rest }) => {
  const [pastLocations, setPastLocations] = useState([]);

  useEffect(() => {
    if (!isEqual(pastLocations[0], location)) {
      setPastLocations([location].concat(pastLocations));
    }
  }, [location, pastLocations]);

  const ctxValue = useMemo(() => ({ ...rest, location, pastLocations }), [
    rest,
    location,
    pastLocations
  ]);

  return <routerCtx.Provider value={ctxValue}>{children}</routerCtx.Provider>;
};

export default withRouter(RouterProvider);
