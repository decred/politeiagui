import React, { Component } from "react";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import { Provider } from "react-redux";
import throttle from "lodash/throttle";
import configureStore from "./configureStore";
import { Subreddit } from "./components/snew";
import HeaderAlert from "./components/HeaderAlert";
import Routes from "./Routes";
import * as pki from "./lib/pki";
import loaderConnector from "./connectors/loader";
import { handleSaveState } from "./lib/localData";
import { saveStateLocalStorage } from "./lib/storage";
import ModalStack from "./components/Modal/ModalStack";

const store = configureStore();

store.subscribe(() => {
  store.getState().api.me.response && saveStateLocalStorage({
    api: {
      me: store.getState().api.me
    }
  });
});

store.subscribe(throttle(() => {
  handleSaveState(store);
}, 1000));

const createStorageListener = store => {
  return event => {
    const state = JSON.parse(event.newValue);
    if (state && !state.api.me.response) store.dispatch({type: "API_RECEIVE_LOGOUT"});
    else if (!state) store.dispatch({type: "API_RECEIVE_LOGOUT"});
  };
};

class Loader extends Component {
  componentWillMount(){
    this.props.onInit();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.loggedInAs) {
      pki.getKeys(nextProps.loggedInAs).then(keys =>
        this.props.keyMismatchAction(keys.publicKey !== nextProps.serverPubkey));
    }
  }

  componentDidMount() {
    window.addEventListener("storage", createStorageListener(store));
    if(this.props.loggedInAs) {
      pki.getKeys(this.props.loggedInAs).then(keys =>
        this.props.keyMismatchAction(keys.publicKey !== this.props.serverPubkey));
    }
  }

  componentWillUnmount() {
    window.removeEventListener("storage");
  }

  render() {
    return (
      <Router>
        <div className="appWrapper">
          <ModalStack />
          {this.props.children}
        </div>
      </Router>
    );
  }
}

const LoaderComponent = loaderConnector(Loader);

const HeaderAlertComponent = withRouter(loaderConnector(({
  location,
  loggedInAs,
  userCanExecuteActions,
  history
}) => {
  if (!loggedInAs) return null;
  if(!userCanExecuteActions && location.pathname !== "/user/account") {
    return (
      <HeaderAlert className="action-needed-alert">
        You cannot currently submit proposals or comments, please visit your{" "}
        <a style={{cursor: "pointer"}} onClick={() => history.push("/user/account")}>account page</a>{" "}
        to correct this problem.
      </HeaderAlert>
    );
  }
  return null;
}));

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <LoaderComponent>
          <HeaderAlertComponent/>
          <Subreddit>
            <Routes />
          </Subreddit>
        </LoaderComponent>
      </Provider>
    );
  }
}
