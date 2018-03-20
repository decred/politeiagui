import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import { Subreddit } from "./components/snew";
import TopModal from "./components/Modals/TopModal";
import Message from "./components/Message";
import Routes from "./Routes";
import * as pki from "./lib/pki";
import loaderConnector from "./connectors/loader";
import throttle from "lodash/throttle";
import { handleSaveState } from "./lib/localData";

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

  renderMismatchKeyModal = () =>
    typeof this.props.keyMismatch === "boolean"
    && this.props.keyMismatch && this.props.loggedInAs &&
    <TopModal className="key-mismatch">
      <Message
        type="error"
        header="Key mismatch"
        body="Key mismatch, please update your key on profile screen to proceed with actions"
      />
    </TopModal>

  render() {
    return (
      <Router>
        <div className="appWrapper">
          {this.renderMismatchKeyModal()}
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
