import React, { useCallback } from "react";
import { TextArea } from "pi-ui";

const TextAreaWrapper = ({ onChange, ...props }) => {

  const handleChange = useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <TextArea
      id={`item-${props.row}-${props.col}`}
      onChange={handleChange}
      value={props.value}
      wrapped={true}
      autoFocus
    />
  );
};

export default TextAreaWrapper;
