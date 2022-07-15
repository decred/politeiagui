import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useEffect
} from "react";
import { withRouter } from "react-router-dom";

const routerCtx = createContext();

export const useRouter = () => useContext(routerCtx);

const RouterProvider = ({ location, children, ...rest }) => {
  const navigationHistory = useRef([]);
  const ctxValue = useMemo(() => ({ ...rest, location }), [rest, location]);
  useEffect(() => {
    navigationHistory.current = [location, ...navigationHistory.current];
  }, [location]);
  return (
    <routerCtx.Provider
      value={{ ...ctxValue, navigationHistory: navigationHistory.current }}
    >
      {children}
    </routerCtx.Provider>
  );
};

export default withRouter(RouterProvider);
