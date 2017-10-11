import React from "react";
import ReactDOM from "react-dom";
import "./style/index.css";
import "font-awesome/css/font-awesome.min.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
