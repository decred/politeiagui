import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import About from "./components/AboutPage";
import Login from "./components/LoginPage";
import Logout from "./components/LogoutPage";
import SignupNext from "./components/SignupNextStepPage";
import Signup from "./components/SignupPage";
import Verify from "./components/Verify";
import VerifySuccess from "./components/Verify/indexSuccess";
import VerifyFailure from "./components/Verify/indexFailure";
import ProposalFind from "./components/ProposalFind";
import VettedProposals from "./components/VettedProposalsPage";
import ProposalStatus from "./components/ProposalStatusPage";
import ProposalDetail from "./components/ProposalDetailPage";
import ProposalSubmit from "./components/ProposalSubmitPage";
import ProposalSubmitSuccess from "./components/ProposalSubmitSuccessPage";
import AuthenticatedRoute from "./components/Router/AuthenticatedRoute";
import AdminAuthenticatedRoute from "./components/Router/AdminAuthenticatedRoute";
import { CensoredProposals, UnreviewedProposals, UnvettedProposals } from "./components/UnvettedProposals";

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" component={VettedProposals} exact={true} />
        <Route path="/about" component={About} />
        <Route path="/proposals/find" component={ProposalFind} />
        <Route path="/user/signup/next" component={SignupNext} />
        <Route path="/user/login" component={Login} />
        <Route path="/user/logout" component={Logout} />
        <Route path="/user/signup" component={Signup} />
        <Route path="/user/verify/success" component={VerifySuccess} />
        <Route path="/user/verify/failure" component={VerifyFailure} />
        <Route path="/user/verify" component={Verify} exact={true} />
        <Route path="/proposals/vetted" component={VettedProposals} />
        <AuthenticatedRoute path="/proposals/new" component={ProposalSubmit} />
        <AuthenticatedRoute path="/proposals/success" component={ProposalSubmitSuccess} />
        <AdminAuthenticatedRoute path="/proposals/:token/status" component={ProposalStatus} />
        <Route path="/proposals/:token" component={ProposalDetail} />
        <AdminAuthenticatedRoute path="/admin/censored" component={CensoredProposals} />
        <AdminAuthenticatedRoute path="/admin/unreviewed" component={UnreviewedProposals} />
        <AdminAuthenticatedRoute path="/admin" component={UnvettedProposals} />
      </Switch>
    );
  }
}

export default Routes;
