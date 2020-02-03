import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";

console.log("OASMPDOMASOPDMAPOSMDPO", App);

const targetElement =
  process.env.NODE_ENV === "test"
    ? document.body
    : document.getElementById("root");

ReactDOM.render(<App />, targetElement);
