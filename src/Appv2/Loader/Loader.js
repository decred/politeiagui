import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLoader } from "./hooks";

export const LoaderContext = createContext();
export const useLoaderContext = () => useContext(LoaderContext);

const Loader = ({ children }) => {
  const [initDone, setInitDone] = useState(false);
  const [error, setError] = useState(null);
  const [apiInfo, setApiInfo] = useState(null);
  const { onRequestApiInfo, onRequestCurrentUser, user } = useLoader();

  useEffect(() => {
    async function onInit() {
      try {
        const apiInfo = await onRequestApiInfo(false);
        setApiInfo(apiInfo);
        if (apiInfo.activeusersession) {
          await onRequestCurrentUser();
        }
        setInitDone(true);
      } catch (e) {
        setError(e);
      }
    }
    onInit();
  }, []);

  return (
    <LoaderContext.Provider
      value={useMemo(
        () => ({
          initDone,
          error,
          currentUser: user,
          apiInfo
        }),
        [initDone, error, apiInfo, user]
      )}
    >
      {initDone && children}
    </LoaderContext.Provider>
  );
};

export default Loader;
