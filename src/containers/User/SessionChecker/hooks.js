import { useState, useEffect, useCallback } from "react";
import * as sel from "src/selectors";
import { useSelector } from "src/redux";

export function useSessionChecker() {
  const currentUser = useSelector(sel.currentUser);
  const [sessionExpired, setSessionExpired] = useState(false);

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
