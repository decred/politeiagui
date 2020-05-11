import { useEffect } from "react";

export default function (globalError) {
  useEffect(
    function scrollToTopOnGlobalError() {
      if (globalError) {
        window.scrollTo(0, 0);
      }
    },
    [globalError]
  );
}
