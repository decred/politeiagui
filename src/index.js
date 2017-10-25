import React from "react";
import ReactDOM from "react-dom";
import "snew-classic-ui/static/css/reddit.css";
import "font-awesome/css/font-awesome.min.css";
//import "./style/theme.css";
import App from "./App";
//import registerServiceWorker from "./registerServiceWorker";
import { unregister } from "./registerServiceWorker";

//ReactDOM.render(<App />, document.getElementById("root"));
ReactDOM.render(<App />, document.body);

unregister();
