import React, { createContext, useContext, useEffect, useState } from "react";
import { useLoader } from "./hooks";
import LoaderScreen from "./LoaderScreen";

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
  }, [onRequestApiInfo, onRequestCurrentUser]);

  return (
    <LoaderContext.Provider
      value={{
        initDone,
        error,
        currentUser: user,
        apiInfo
      }}
    >
      {initDone && !error ? children : <LoaderScreen error={error} />}
    </LoaderContext.Provider>
  );
};

export default Loader;
