import React from "react";
import MarkdownEditor from "../../MarkdownEditor";

const MarkdownEditorField = ({
  input,
  touched,
  error,
  disabled,
  tabIndex,
  toggledStyle
}) => {
  return (
    <div className="ffmarkdown-editor">
      <div className="ffeditor usertext">
        <MarkdownEditor
          value={input.value}
          onChange={input.onChange}
          tabIndex={tabIndex}
          toggledStyle={toggledStyle} />
      </div>
      {touched && error && !disabled && <span className="error">{error}</span>}
    </div>
  );
};

export default MarkdownEditorField;
