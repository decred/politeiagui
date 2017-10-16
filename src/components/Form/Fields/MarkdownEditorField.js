import React from "react";
import Markdown from "../../MarkdownRenderer";
import MDEditor from "../../markdown";

const MarkdownEditorField = ({ placeholder, input, rows, cols, touched, error, disabled }) => {
  return (
    <div className="markdown-editor">
      <div className="editor">
        <MDEditor
          placeholder={placeholder}
          rows={rows}
          cols={cols}
          {...input}
        />
      </div>
      {touched && error && !disabled && <span className="error">{error}</span>}
      <div className="preview">
        <Markdown value={input.value} />
      </div>
    </div>
  );
};

export default MarkdownEditorField;
