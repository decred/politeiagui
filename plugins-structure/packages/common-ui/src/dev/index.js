import React from "react";
import ReactDOM from "react-dom";
import { DiffHTML } from "../components/Diff";

const newHeaders =
  "# Header 1\n## Header 2\n### Header 3\n##### common header\n\n";
const oldHeaders =
  "# Header 1 ADD\n## Header 2\n#### Header 4\n##### common header\n\n";
const newParagraph = "Paragraph 1\n\nAnother P";
const oldParagraph = "Paragraph 2\n\nAnother P";

ReactDOM.render(
  <div id="markdown-diff-wrapper">
    <DiffHTML oldText={oldHeaders} newText={newHeaders} />
    <div style={{ width: "90%", border: "1px solid black", margin: "2rem" }} />
    <DiffHTML oldText={oldParagraph} newText={newParagraph} />
  </div>,
  document.querySelector("#root")
);
