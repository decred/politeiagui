import { useLayoutEffect, useCallback, useRef } from "react";

function useScrollTo(element, shouldScroll) {
  // This ref is used to hold the setTimeout timer to clean it up
  // on unmount.
  const timer = useRef(null);
  const scrollToElement = useCallback((element) => {
    timer.current = setTimeout(
      () => document.getElementById(element).scrollIntoView(),
      100
    );
  }, []);

  useLayoutEffect(() => {
    shouldScroll && scrollToElement(element);

    // Cleanup timer on unmount
    return () => timer.current && clearTimeout(timer.current);
  }, [element, scrollToElement, shouldScroll]);
}

export default useScrollTo;
