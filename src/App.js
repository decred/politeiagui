import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import Header from "./components/Header";
import Home from "./components/HomePage";
import VettedProposals from "./components/VettedProposalsPage";
import ProposalDetail from "./components/ProposalDetailPage";
import ProposalSubmit from "./components/ProposalSubmitPage";

const store = configureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router onChange={this.handleRoute}>
          <div id="app">
            <Header />
            <Switch>
              <Route path="/" component={Home} exact={true} />
              <Route path="/proposals/vetted" component={VettedProposals} />
              <Route path="/proposals/new" component={ProposalSubmit} />
              <Route path="/proposals/:token" component={ProposalDetail} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
