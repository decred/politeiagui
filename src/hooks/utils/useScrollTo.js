import { useLayoutEffect } from "react";

const scrollToElement = (element) =>
  setTimeout(() => {
    const elm = document.getElementById(element);
    elm && elm.scrollIntoView();
  }, 100);

function useScrollTo(element, shouldScroll) {
  useLayoutEffect(() => {
    shouldScroll && scrollToElement(element);
  }, [element, shouldScroll]);
}

export default useScrollTo;
