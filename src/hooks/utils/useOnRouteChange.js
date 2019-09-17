import { useEffect } from "react";
import { useRouter } from "src/componentsv2/Router";

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
  useEffect(() => {
    callbackFn();
  }, [location.pathname, callbackFn]);
}

export default useOnRouteChange;
