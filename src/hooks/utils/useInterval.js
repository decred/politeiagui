import { useEffect, useRef } from "react";

export default function useInterval(intervalLength, active, callbackFn) {
  const interval = useRef(null);
  useEffect(() => {
    if (active && !interval.current) {
      interval.current = setInterval(callbackFn, intervalLength);
    }
    return () => {
      if (interval.current !== null) {
        clearInterval(interval.current);
      }
    };
  }, [active, callbackFn, intervalLength]);
}
