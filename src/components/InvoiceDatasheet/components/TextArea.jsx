import React, { useCallback } from "react";
import { TextArea } from "pi-ui";

const TextAreaWrapper = ({ onChange, row, col, value }) => {
  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <TextArea
      id={`item-${row}-${col}`}
      onChange={handleChange}
      value={value}
      wrapped={true}
      autoFocus
    />
  );
};

export default TextAreaWrapper;
