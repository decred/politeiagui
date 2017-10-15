import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import Header from "./components/Header";
import Routes from "./Routes";
const store = configureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router onChange={this.handleRoute}>
          <div id="app">
            <Header />
            <Routes />
          </div>
        </Router>
      </Provider>
    );
  }
}
