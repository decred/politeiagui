import { useState, useEffect, useCallback } from "react";
import { useLoaderContext } from "src/containers/Loader";

export function useSessionChecker() {
  const [sessionExpired, setSessionExpired] = useState(false);
  const { currentUser } = useLoaderContext();

  const checkUserSession = useCallback(() => {
    if (currentUser && !sessionExpired) {
      const { sessionmaxage, lastlogintime } = currentUser;
      const expired = sessionmaxage < Date.now() / 1000 - lastlogintime;
      setSessionExpired(expired);
    }
  }, [currentUser, sessionExpired]);

  useEffect(() => {
    checkUserSession();
  });

  return { sessionExpired, setSessionExpired };
}
