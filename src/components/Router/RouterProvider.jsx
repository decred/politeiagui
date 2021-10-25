import React, { createContext, useContext, useMemo } from "react";
import { withRouter } from "react-router-dom";

const routerCtx = createContext();

export const useRouter = () => useContext(routerCtx);

const RouterProvider = ({ location, children, ...rest }) => {
  const ctxValue = useMemo(() => ({ ...rest, location }), [rest, location]);

  return <routerCtx.Provider value={ctxValue}>{children}</routerCtx.Provider>;
};

export default withRouter(RouterProvider);
