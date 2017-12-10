import React, { Component } from "react";
import { Subreddit } from "snew-classic-ui";
import { Switch, Route, withRouter } from "react-router-dom";
import routeChangeConnector from "../../connectors/routeChange";

const noSidebar = (p1) => (p2) => <Subreddit {...{...p2, ...p1}} useSidebar={false} />;
const withSidebar = (p1) => (p2) => <Subreddit {...{...p2, ...p1}} useSidebar={true} />;

class CustomSubreddit extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.props.onRouteChange();
    }
  }

  render() {
    return (
      <Switch>
        <Route path="/user/signup" component={noSidebar(this.props)} />
        <Route path="*" component={withSidebar(this.props)} />
      </Switch>
    );
  }
}

export default withRouter(routeChangeConnector(CustomSubreddit));

