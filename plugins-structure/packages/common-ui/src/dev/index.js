import React from "react";
import ReactDOM from "react-dom";
import { DiffHTML } from "../components/Diff";

const newHeaders =
  "# Header 1\n## Header 2\n### Header 3\n##### common header\n\n";
const oldHeaders =
  "# Header 1 ADD\n## Header 2\n#### Header 4\n##### common header\n\n";
const newParagraph = "Paragraph 1\n\nAnother P";
const oldParagraph = "Paragraph 2\n\nAnother P";
const oldLink = "[my link](http://mylink.com)";
const newLink = "[my link](http://mylinknew.com)";
const p1 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.";
const p2 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Donec rutrum congue leo eget malesuada.";

ReactDOM.render(
  <div id="markdown-diff-wrapper">
    <DiffHTML oldText={oldHeaders} newText={newHeaders} />
    <div style={{ width: "90%", border: "1px solid black", margin: "2rem" }} />
    <DiffHTML oldText={oldParagraph} newText={newParagraph} />
    <div style={{ width: "90%", border: "1px solid black", margin: "2rem" }} />
    <DiffHTML oldText={oldLink} newText={newLink} />
    <div style={{ width: "90%", border: "1px solid black", margin: "2rem" }} />
    <DiffHTML oldText="**old**" newText="old" />
    <div style={{ width: "90%", border: "1px solid black", margin: "2rem" }} />
    <DiffHTML oldText={p1} newText={p2} />
  </div>,
  document.querySelector("#root")
);
