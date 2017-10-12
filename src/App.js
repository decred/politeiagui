import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import Header from "./components/Header";
import About from "./components/AboutPage";
import Login from "./components/LoginPage";
import SignupNext from "./components/SignupNextStepPage";
import Signup from "./components/SignupPage";
import AdminLanding from "./components/AdminLanding";
import VettedProposals from "./components/VettedProposalsPage";
import ProposalDetail from "./components/ProposalDetailPage";
import ProposalSubmit from "./components/ProposalSubmitPage";
import AuthenticatedRoute from "./components/Router/AuthenticatedRoute";
import AdminAuthenticatedRoute from "./components/Router/AdminAuthenticatedRoute";

const store = configureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router onChange={this.handleRoute}>
          <div id="app">
            <Header />
            <Switch>
              <Route path="/" component={VettedProposals} exact={true} />
              <Route path="/about" component={About} />
              <Route path="/user/signup/next" component={SignupNext} />
              <Route path="/user/login" component={Login} />
              <Route path="/user/signup" component={Signup} />
              <AuthenticatedRoute path="/proposals/vetted" component={VettedProposals} />
              <AuthenticatedRoute path="/proposals/new" component={ProposalSubmit} />
              <AuthenticatedRoute path="/proposals/:token" component={ProposalDetail} />
              <AdminAuthenticatedRoute path="/admin" component={AdminLanding} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
