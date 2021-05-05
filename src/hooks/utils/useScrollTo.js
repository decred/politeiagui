import { useLayoutEffect } from "react";

const scrollToElement = (element) =>
  setTimeout(() => {
    document.getElementById(element).scrollIntoView();
  }, 100);

function useScrollTo(element, shouldScroll) {
  useLayoutEffect(() => {
    shouldScroll && scrollToElement(element);
  }, [element, shouldScroll]);
}

export default useScrollTo;
