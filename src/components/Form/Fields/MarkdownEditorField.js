import React from "react";
import Markdown from "../../MarkdownRenderer";

const MarkdownEditorField = ({ placeholder, input, rows, cols, touched, error, disabled }) => (
  <div className="markdown-editor">
    <div className="editor">
    <textarea
      {...input}
      {...{
      placeholder,
      rows,
      cols,
      // onInput: this.onChange,
      // onChange: this.onChange
    }} />
    </div>
    {touched && error && !disabled && <span className="error">{error}</span>}
    <div className="preview">
      <Markdown value={input.value} />
    </div>
  </div>
);

export default MarkdownEditorField;
