import React from "react";
import Markmirror from "react-markmirror";
import Snudownd from "snuownd";
const parser = Snudownd.getParser();

const renderToolbar = children => (markmirror, renderButton) => (
  <div className="markmirror__toolbar myapp__toolbar">
    {renderButton("preview")}
    <span className="markmirror__button-separator"></span>
    {renderButton("h1")}
    {renderButton("h2")}
    {renderButton("h3")}
    <span className="markmirror__button-separator"></span>
    {renderButton("quote")}
    {renderButton("oList")}
    {renderButton("uList")}
    {renderButton("bold")}
    {renderButton("italic")}
    {renderButton("link")}
    {children}
    <span className="markmirror__button-separator"></span>
    {renderButton("full")}
  </div>
);

const MarkdownEditorField = ({ placeholder, input, touched, error, disabled, children }) => {
  return console.log("input", input) || (
    <div className="ffmarkdown-editor">
      <div className="ffeditor usertext">
        <Markmirror theme="light" {...{
          value: input.value,
          onChange: input.onChange,
          placeholder,
          renderToolbar: renderToolbar(children),
          children,
          onPreview(body) {
            return `<div class="md md-preview">${parser.render(body)}`;
          }
        }} />
      </div>
      {touched && error && !disabled && <span className="error">{error}</span>}
    </div>
  );
};

export default MarkdownEditorField;
