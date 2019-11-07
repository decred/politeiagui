import { useState, useCallback } from "react";

export default function(initialValue) {
  const [value, setValue] = useState(initialValue);

  const setValueFalse = useCallback(e => {
    if (e) e.preventDefault();
    setValue(false);
  }, []);

  const setValueTrue = useCallback(e => {
    if (e) e.preventDefault();
    setValue(true);
  }, []);

  return [value, setValueTrue, setValueFalse];
}
