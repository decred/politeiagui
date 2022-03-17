import React, { useState } from "react";
import ReactDOM from "react-dom";
import { DiffHTML, MarkdownEditor } from "../components/Markdown";
import {
  DEFAULT_DARK_THEME_NAME,
  DEFAULT_LIGHT_THEME_NAME,
  ThemeProvider,
  defaultDarkTheme,
  defaultLightTheme,
} from "pi-ui";
import "pi-ui/dist/index.css";

const themes = {
  [DEFAULT_LIGHT_THEME_NAME]: { ...defaultLightTheme },
  [DEFAULT_DARK_THEME_NAME]: { ...defaultDarkTheme },
};

function MdTest() {
  const [old, setOld] = useState("");
  const [nw, setNew] = useState("");

  return (
    <>
      <MarkdownEditor onChange={(e) => setOld(e)} />
      <MarkdownEditor onChange={(e) => setNew(e)} />
      <div
        style={{ width: "90%", border: "1px solid black", margin: "2rem" }}
      />
      <DiffHTML oldText={old} newText={nw} />
    </>
  );
}

ReactDOM.render(
  <ThemeProvider themes={themes} defaultThemeName={DEFAULT_LIGHT_THEME_NAME}>
    <h1>Markdown</h1>
    <br />
    <div id="markdown-diff-wrapper">
      <MdTest />
    </div>
  </ThemeProvider>,
  document.querySelector("#root")
);
