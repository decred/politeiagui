import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import About from "./components/AboutPage";
import Login from "./components/LoginPage";
import SignupNext from "./components/SignupNextStepPage";
import Signup from "./components/SignupPage";
import ProposalFind from "./components/ProposalFind";
import AdminLanding from "./components/AdminLanding";
import VettedProposals from "./components/VettedProposalsPage";
import ProposalDetail from "./components/ProposalDetailPage";
import ProposalSubmit from "./components/ProposalSubmitPage";
import AuthenticatedRoute from "./components/Router/AuthenticatedRoute";
import AdminAuthenticatedRoute from "./components/Router/AdminAuthenticatedRoute";

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" component={VettedProposals} exact={true} />
        <Route path="/about" component={About} />
        <Route path="/proposals/find" component={ProposalFind} />
        <Route path="/user/signup/next" component={SignupNext} />
        <Route path="/user/login" component={Login} />
        <Route path="/user/signup" component={Signup} />
        <AuthenticatedRoute path="/proposals/vetted" component={VettedProposals} />
        <AuthenticatedRoute path="/proposals/new" component={ProposalSubmit} />
        <AuthenticatedRoute path="/proposals/:token" component={ProposalDetail} />
        <AdminAuthenticatedRoute path="/admin" component={AdminLanding} />
      </Switch>
    );
  }
}

export default Routes;
