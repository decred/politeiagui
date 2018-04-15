import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import throttle from "lodash/throttle";
import configureStore from "./configureStore";
import { Subreddit } from "./components/snew";
import HeaderAlert from "./components/HeaderAlert";
import Routes from "./Routes";
import * as pki from "./lib/pki";
import loaderConnector from "./connectors/loader";
import { handleSaveState } from "./lib/localData";
import ModalStack from "./components/Modal/ModalStack";

const store = configureStore();

store.subscribe(throttle(() => {
  handleSaveState(store);
}, 1000));

class Loader extends Component {

  componentWillReceiveProps(nextProps) {
    if(nextProps.loggedInAs) {
      pki.getKeys(nextProps.loggedInAs).then(keys =>
        this.props.keyMismatchAction(keys.publicKey !== nextProps.serverPubkey));
    }
  }

  componentDidMount() {
    this.props.onInit();
    if(this.props.loggedInAs) {
      pki.getKeys(this.props.loggedInAs).then(keys =>
        this.props.keyMismatchAction(keys.publicKey !== this.props.serverPubkey));
    }
  }

  renderHeaderAlert = () => {
    if(!this.props.loggedInAs) {
      return null;
    }

    if(this.props.paywallAddress || this.props.keyMismatch === true) {
      return (
        <HeaderAlert className="action-needed-alert">
          You cannot currently submit proposals or comments, please visit your{" "}
          <a href="/user/account">account page</a> to correct this problem.
        </HeaderAlert>
      );
    }
  }

  render() {
    return (
      <Router>
        <div className="appWrapper">
          <ModalStack />
          {this.renderHeaderAlert()}
          {this.props.children}
        </div>
      </Router>
    );
  }
}

const LoaderComponent = loaderConnector(Loader);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <LoaderComponent>
          <Subreddit>
            <Routes />
          </Subreddit>
        </LoaderComponent>
      </Provider>
    );
  }
}
