import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import { withRouter } from "react-router-dom";

const dccCtx = createContext();

export const useDCC = () => useContext(dccCtx);

const DCCProvider = ({ location, children }) => {
  const [isDCC, setIsDCC] = useState();

  useEffect(() => {
    setIsDCC(location.pathname.includes("/dcc/"));
  }, [location]);

  return <dccCtx.Provider value={{ isDCC }}>{children}</dccCtx.Provider>;
};

export default withRouter(DCCProvider);
