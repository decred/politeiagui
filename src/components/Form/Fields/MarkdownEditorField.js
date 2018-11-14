import React from "react";
import MarkdownEditor from "../../MarkdownEditor";

const MarkdownEditorField = ({
  input,
  disabled,
  error,
  touched,
  tabIndex,
  toggledStyle,
  meta = {}
}) => {
  const hasError =
    (error && touched && !disabled) || (meta.error && meta.touched);
  const { warning } = meta;
  return (
    <div className="ffmarkdown-editor">
      <div className="ffeditor usertext">
        <MarkdownEditor
          value={input.value}
          onChange={input.onChange}
          tabIndex={tabIndex}
          toggledStyle={toggledStyle}
        />
      </div>
      <div className="input-subline">
        {(hasError && (
          <div className="input-error">{meta.error || error}</div>
        )) ||
          (warning && <div className="input-warning">{warning}</div>)}
      </div>
    </div>
  );
};

export default MarkdownEditorField;
