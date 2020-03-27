import { useState } from "react";

function useAsyncState(initialValue) {
  const [value, setValue] = useState(initialValue);
  const setter = (x) =>
    new Promise((resolve) => {
      setValue(x);
      resolve(x);
    });
  return [value, setter];
}

export default useAsyncState;
