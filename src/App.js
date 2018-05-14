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
import { onLogout } from "./actions/api";
import ModalStack from "./components/Modal/ModalStack";

const store = configureStore();
let sideTop = null;

store.subscribe(
  throttle(() => {
    handleSaveState(store);
    store.getState().api.me.response &&
    saveStateLocalStorage({
      api: {
        me: store.getState().api.me
      }
    });
  }, 1000)
);

const createStorageListener = store => {
  return event => {
    try {
      const state = JSON.parse(event.newValue);
      if (state && !state.api.me.response) store.dispatch(onLogout());
      else if (!state) store.dispatch(onLogout());
    } catch (e) {
      store.dispatch(onLogout());
    }
  };
};

function lockSideOnScroll() {
  const html = document.querySelector("html");
  const htmlScroll = html.scrollTop;
  const htmlHeight = html.scrollHeight;
  const side = document.querySelector(".side");
  const contentHeight = document.querySelector(".content").scrollHeight;

  if (htmlHeight - htmlScroll <= 1022) {
    sideTop = sideTop === null ? htmlScroll : sideTop;
    side.style.position = "absolute";
    side.style.top = `${contentHeight - 495}px`;
  } else {
    sideTop = null;
    side.style.position = "fixed";
    side.style.top = null;
  }
}

class Loader extends Component {
  componentWillMount() {
    this.props.onInit();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedInAsEmail) {
      pki
        .getKeys(nextProps.loggedInAsEmail)
        .then(keys =>
          this.props.keyMismatchAction(
            keys.publicKey !== nextProps.serverPubkey
          )
        );
    }
  }

  componentDidMount() {
    window.addEventListener("storage", createStorageListener(store));
    window.addEventListener("scroll", lockSideOnScroll);

    if (this.props.loggedInAsEmail) {
      pki
        .getKeys(this.props.loggedInAsEmail)
        .then(keys =>
          this.props.keyMismatchAction(
            keys.publicKey !== this.props.serverPubkey
          )
        );
    }
  }

  componentWillUnmount() {
    window.removeEventListener("storage");
    window.addEventListener("scroll", lockSideOnScroll);
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

const HeaderAlertComponent = withRouter(
  loaderConnector(
    ({ location, loggedInAsEmail, userCanExecuteActions, history }) => {
      if (!loggedInAsEmail) return null;
      if (!userCanExecuteActions && location.pathname !== "/user/account") {
        return (
          <HeaderAlert className="action-needed-alert">
						You cannot currently submit proposals or comments, please visit your{" "}
            <a
              style={{ cursor: "pointer" }}
              onClick={() => history.push("/user/account")}
            >
							account page
            </a>{" "}
						to correct this problem.
          </HeaderAlert>
        );
      }
      return null;
    }
  )
);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <LoaderComponent>
          <HeaderAlertComponent />
          <Subreddit>
            <Routes />
          </Subreddit>
        </LoaderComponent>
      </Provider>
    );
  }
}
