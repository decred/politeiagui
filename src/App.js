import React, { Component } from "react";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import { Provider } from "react-redux";
import throttle from "lodash/throttle";
import configureStore from "./configureStore";
import { Subreddit } from "./components/snew";
import HeaderAlert from "./components/HeaderAlert";
import Routes from "./Routes";
import loaderConnector from "./connectors/loader";
import { handleSaveTextEditorsContent } from "./lib/editors_content_backup";
import { handleSaveStateToLocalStorage } from "./lib/local_storage";
import { onLocalStorageChange } from "./actions/app";
import ModalStack from "./components/Modal/ModalStack";
import { ONBOARD } from "./components/Modal/modalTypes";
import { verifyUserPubkey } from "./helpers";

const store = configureStore();

store.subscribe(throttle(() => {
  const state = store.getState();
  handleSaveTextEditorsContent(state);
  handleSaveStateToLocalStorage(state);
}, 1000));

const createStorageListener = store => event => store.dispatch(onLocalStorageChange(event));

class Loader extends Component {
  constructor(props) {
    super();
    props.onInit();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.loggedInAsEmail && this.props.loggedInAsEmail) {
      verifyUserPubkey(this.props.loggedInAsEmail, this.props.userPubkey, this.props.keyMismatchAction);
      this.props.onLoadDraftProposals(this.props.loggedInAsEmail);
      this.props.onLoadPaymentPollingQueue(this.props.loggedInAsEmail);
    }

    if(!prevProps.onboardViewed && this.props.lastLoginTime === 0){
      this.props.setOnboardAsViewed();
      this.props.openModal(ONBOARD);
    }


    if (!prevProps.apiError && this.props.apiError) {
      // Unrecoverable error
      if (this.props.apiError.internalError) {
        this.props.history.push(`/500?error=${this.props.apiError.message}`);
      } else {
        console.error("ERROR:", this.props.apiError.message);
      }
    }
  }

  componentDidMount() {
    if (this.props.loggedInAsEmail) {
      verifyUserPubkey(this.props.loggedInAsEmail, this.props.userPubkey, this.props.keyMismatchAction);
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
        <Router>
          <LoaderComponent>
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
