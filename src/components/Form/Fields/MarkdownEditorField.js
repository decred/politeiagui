import React from "react";
import MarkdownEditor from "../../MarkdownEditor";

const MarkdownEditorField = ({ input, touched, error, disabled }) => {
  return console.log("input", input) || (
    <div className="ffmarkdown-editor">
      <div className="ffeditor usertext">
        <MarkdownEditor value={input.value} onChange={input.onChange} />
      </div>
      {touched && error && !disabled && <span className="error">{error}</span>}
    </div>
  );
};

export default MarkdownEditorField;
