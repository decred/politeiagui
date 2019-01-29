import React, { Component } from "react";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import { Provider } from "react-redux";
import throttle from "lodash/throttle";
import configureStore from "./configureStore";
import { Subreddit } from "./components/snew";
import HeaderAlert from "./components/HeaderAlert";
import SessionExpiresIndicator from "./components/SessionExpiresIndicator";
import Routes from "./Routes";
import loaderConnector from "./connectors/loader";
import { handleSaveTextEditorsContent } from "./lib/editors_content_backup";
import { handleSaveStateToLocalStorage } from "./lib/local_storage";
import { onLocalStorageChange } from "./actions/app";
import ModalStack from "./components/Modal/ModalStack";
import { WELCOME_MODAL } from "./components/Modal/modalTypes";
import { verifyUserPubkey } from "./helpers";

const store = configureStore();

store.subscribe(
  throttle(() => {
    const state = store.getState();
    handleSaveTextEditorsContent(state);
    handleSaveStateToLocalStorage(state);
  }, 1000)
);

const createStorageListener = store => event =>
  store.dispatch(onLocalStorageChange(event));

class Loader extends Component {
  constructor(props) {
    super();
    props.onInit();
  }

  componentDidUpdate(prevProps) {
    const isUserFirstLogin = this.props.lastLoginTime === 0;
    const criticalAPIError = !prevProps.apiError && this.props.apiError;

    if (!prevProps.loggedInAsEmail && this.props.loggedInAsEmail) {
      this.props.onLoadDraftProposals(this.props.loggedInAsEmail);
    }
    if (prevProps.userPubkey && this.props.userPubkey) {
      verifyUserPubkey(
        this.props.loggedInAsEmail,
        this.props.userPubkey,
        this.props.keyMismatchAction
      );
    }

    if (!prevProps.onboardViewed && isUserFirstLogin) {
      const { setOnboardAsViewed, openModal } = this.props;
      setOnboardAsViewed();
      openModal(WELCOME_MODAL);
    }

    if (criticalAPIError) {
      // Unrecoverable error
      if (this.props.apiError.internalError) {
        this.props.history.push("/500");
      } else {
        console.error("ERROR:", this.props.apiError.message);
      }
    }
  }

  componentDidMount() {
    if (this.props.loggedInAsEmail) {
      verifyUserPubkey(
        this.props.loggedInAsEmail,
        this.props.userPubkey,
        this.props.keyMismatchAction
      );
    }

    this.storageListener = createStorageListener(store);
    window.addEventListener("storage", this.storageListener);
  }

  componentWillUnmount() {
    window.removeEventListener("storage", this.storageListener);
  }

  render() {
    return (
      <div className="appWrapper">
        <ModalStack />
        {this.props.children}
      </div>
    );
  }
}

const LoaderComponent = withRouter(loaderConnector(Loader));

const StagingAlert = () =>
  process.env.REACT_APP_STAGING ? (
    <div className="staging-alert">
      This is the politeia staging environment. DO NOT USE, YOU WILL LOSE YOUR
      DECRED.
    </div>
  ) : null;

const HeaderAlertComponent = withRouter(
  loaderConnector(
    ({
      location,
      loggedInAsEmail,
      keyMismatch,
      history,
      loggedInAsUserId,
      identityImportSuccess
    }) => {
      if (!loggedInAsEmail) return null;
      if (
        keyMismatch &&
        !identityImportSuccess &&
        location.pathname !== `/user/${loggedInAsUserId}`
      ) {
        return (
          <HeaderAlert className="action-needed-alert">
            You cannot currently submit proposals or comments, please visit your{" "}
            <span
              className="linkish"
              style={{ cursor: "pointer" }}
              onClick={() => history.push(`/user/${loggedInAsUserId}`)}
            >
              account page
            </span>{" "}
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
        <Router>
          <LoaderComponent>
            <StagingAlert />
            <SessionExpiresIndicator />
            <HeaderAlertComponent />
            <Subreddit>
              <Routes />
            </Subreddit>
          </LoaderComponent>
        </Router>
      </Provider>
    );
  }
}
