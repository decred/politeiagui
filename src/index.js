import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const targetElement =
  process.env.REACT_APP_PRESET !== "CMS" || process.env.NODE_ENV === "test"
    ? document.getElementById("root")
    : document.body;

ReactDOM.render(<App />, targetElement);
