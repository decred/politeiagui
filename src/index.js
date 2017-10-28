import React from "react";
import ReactDOM from "react-dom";
import "snew-classic-ui/static/css/reddit.css";
import "font-awesome/css/font-awesome.min.css";
import "codemirror/lib/codemirror.css";
import "react-markmirror/src/less/main.less";
import "./style/index.css";
import "./style/theme/index.css";
import App from "./App";
//import registerServiceWorker from "./registerServiceWorker";
import { unregister } from "./registerServiceWorker";

//ReactDOM.render(<App />, document.getElementById("root"));
ReactDOM.render(<App />, document.body);

unregister();
