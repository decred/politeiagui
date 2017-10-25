import React from "react";
import Markdown from "../../MarkdownRenderer";
//import MDEditor from "../../markdown";
import Markmirror from "react-markmirror";


const renderToolbar = (markmirror, renderButton) => (
  <div className="markmirror__toolbar myapp__toolbar">
    {renderButton("h1")}
    {renderButton("h2")}
    {renderButton("quote")}
    {renderButton("oList")}
    {renderButton("uList")}
    {renderButton("link")}
    {renderButton("bold")}
    {renderButton("italic")}
  </div>
);

const MarkdownEditorField = ({ placeholder, input, touched, error, disabled }) => {
  return (
    <div className="ffmarkdown-editor">
      <div className="ffeditor">
        <Markmirror theme="light" {...{...input, placeholder, renderToolbar}} />
      </div>
      {touched && error && !disabled && <span className="error">{error}</span>}
      <div className="preview">
        <Markdown value={input.value} />
      </div>
    </div>
  );
};

export default MarkdownEditorField;
