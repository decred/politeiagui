import { useState, useCallback } from "react";

export default function(initialValue) {
  const [value, setValue] = useState(initialValue);

  const setValueFalse = useCallback(() => {
    setValue(false);
  }, []);

  const setValueTrue = useCallback(() => {
    setValue(true);
  }, []);

  return [value, setValueTrue, setValueFalse];
}
