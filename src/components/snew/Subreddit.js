import React, { Component } from "react";
import { Subreddit } from "snew-classic-ui";
import { Switch, Route, withRouter } from "react-router-dom";
import routeChangeConnector from "../../connectors/routeChange";
import { loadStateLocalStorage } from "../../lib/local_storage";

const noSidebar = p1 => p2 => (
  <Subreddit {...{ ...p2, ...p1 }} useSidebar={false} />
);
const withSidebar = p1 => p2 => (
  <Subreddit {...{ ...p2, ...p1 }} useSidebar={true} />
);

class CustomSubreddit extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.props.onRouteChange();
      window.scrollTo(0, 0);
    }
    const stateFromLocalStorage = loadStateLocalStorage();
    if (
      stateFromLocalStorage &&
      stateFromLocalStorage.api &&
      stateFromLocalStorage.api.me
    ) {
      this.props.onLoadMe(stateFromLocalStorage.api.me);
    }
  }

  render() {
    return (
      <Switch>
        <Route path="/user/signup" component={noSidebar(this.props)} />
        <Route path="/user/login" component={noSidebar(this.props)} />
        <Route
          path="*"
          component={
            this.props.isCMS ? noSidebar(this.props) : withSidebar(this.props)
          }
        />
      </Switch>
    );
  }
}

export default withRouter(routeChangeConnector(CustomSubreddit));
