import { useEffect, useRef } from "react";
import { useRouter } from "src/components/Router";

/**
 * Watch for route changes and triggers the callbackFn when
 * route changes.
 *
 * @param {Boolean} active - if hook is active or not
 * @param {Function} callbackFn - function that will be
 * triggered when route changes
 */
function useOnRouteChange(callbackFn) {
  const { location } = useRouter();
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) {
      callbackFn();
    } else {
      mountedRef.current = true;
    }
  }, [callbackFn, location.pathname]);
}

export default useOnRouteChange;
