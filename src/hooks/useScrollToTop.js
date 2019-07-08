import { useLayoutEffect } from "react";

function useScrollToTop(disable = false) {
  useLayoutEffect(() => {
    if (!disable) {
      window.scrollTo(0, 0);
    }
  }, []);
}

export default useScrollToTop;
