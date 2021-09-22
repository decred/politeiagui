import { useState, useEffect, useCallback, useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";

export function useSessionChecker() {
  const currentUser = useSelector(sel.currentUser);
  const handleLogout = useAction(act.handleLocalLogout);
  const [sessionExpired, setSessionExpired] = useState();
  const timeout = useMemo(() => {
    if (!currentUser) return;
    const { sessionmaxage, lastlogintime } = currentUser;
    return sessionmaxage * 1000 - (Date.now() / 1000 - lastlogintime);
  }, [currentUser]);

  const checkUserSession = useCallback(() => {
    const { sessionmaxage, lastlogintime } = currentUser;
    const expired = sessionmaxage < Date.now() / 1000 - lastlogintime;
    setSessionExpired(expired);
  }, [currentUser]);

  useEffect(() => {
    let interval;
    if (timeout) {
      interval = setInterval(() => {
        checkUserSession();
      }, timeout);
    }
    return () => {
      interval && clearInterval(interval);
    };
  }, [timeout, checkUserSession]);

  return { sessionExpired, setSessionExpired, handleLogout };
}
