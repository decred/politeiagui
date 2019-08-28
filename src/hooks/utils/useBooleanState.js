import { useState } from "react";

export default function(initialValue) {
  const [value, setValue] = useState(initialValue);

  function setValueFalse() {
    setValue(false);
  }

  function setValueTrue() {
    setValue(true);
  }

  return [value, setValueTrue, setValueFalse];
}
