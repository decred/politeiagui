import React from "react";
import { Subreddit } from "snew-classic-ui";
import { Switch, Route } from "react-router-dom";

const noSidebar = (p1) => (p2) => <Subreddit {...{...p2, ...p1}} useSidebar={false} />;
const withSidebar = (p1) => (p2) => <Subreddit {...{...p2, ...p1}} useSidebar={true} />;

const CustomSubreddit = (props) => (
  <Switch>
    <Route path="/user/signup" component={noSidebar(props)}  />
    <Route path="*" component={withSidebar(props)}/>
  </Switch>
);

export default CustomSubreddit;

