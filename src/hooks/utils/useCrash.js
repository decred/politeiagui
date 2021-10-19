import { useCallback, useState } from "react";

export default function useCrash() {
  const [, setState] = useState();
  return useCallback(
    (err) =>
      setState(() => {
        throw err;
      }),
    []
  );
}
