import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import { Subreddit } from "./components/snew";
import Routes from "./Routes";
import loaderConnector from "./connectors/loader";
import throttle from "lodash/throttle";
import { handleSaveState } from "./lib/localData";

const store = configureStore();

store.subscribe(throttle(() => {
  handleSaveState(store);
}, 1000));

class Loader extends Component {
  componentDidMount() {
    this.props.onInit();
  }

  render() {
    return this.props.children;
  }
}

const LoaderComponent = loaderConnector(Loader);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <LoaderComponent>
          <Router>
            <Subreddit>
              <Routes />
            </Subreddit>
          </Router>
        </LoaderComponent>
      </Provider>
    );
  }
}
