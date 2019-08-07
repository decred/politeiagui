import { useState, useEffect } from "react";
import { useLoaderContext } from "src/Appv2/Loader";

export function useSessionChecker() {
  const [sessionExpired, setSessionExpired] = useState(false);
  const { currentUser } = useLoaderContext();
  useEffect(() => {
    if (currentUser) {
      const { sessionmaxage, lastlogintime } = currentUser;
      const expired = sessionmaxage < Date.now() / 1000 - lastlogintime;
      setSessionExpired(expired);
    }
  });

  return { sessionExpired, setSessionExpired };
}
