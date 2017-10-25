import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { LoginSignupPage, Content as ProposalListing } from "./components/snew";
import vetted from "./connectors/proposals";
import proposalDetail from "./connectors/proposal";
import censored from "./connectors/censoredProposals";
import unreviewed from "./connectors/unreviewedProposals";
import admin from "./connectors/admin";

import About from "./components/AboutPage";
import Login from "./components/LoginPage";
import Logout from "./components/LogoutPage";
import SignupNext from "./components/SignupNextStepPage";
import ForgottenPassword from "./components/ForgottenPasswordPage";
import ForgottenPasswordSuccess from "./components/ForgottenPassword/SuccessPage";
import PasswordReset from "./components/PasswordResetPage";
import PasswordResetSuccess from "./components/PasswordReset/SuccessPage";
import Verify from "./components/Verify";
import VerifySuccess from "./components/Verify/indexSuccess";
import VerifyFailure from "./components/Verify/indexFailure";
import ProposalFind from "./components/ProposalFind";
import NotFound from "./components/NotFoundPage";
import VettedProposals from "./components/VettedProposalsPage";
import ProposalStatus from "./components/ProposalStatusPage";
import ProposalDetail from "./components/ProposalDetail";
import ProposalSubmit from "./components/ProposalSubmitPage";
import ProposalSubmitSuccess from "./components/ProposalSubmitSuccessPage";
import AuthenticatedRoute from "./components/Router/AuthenticatedRoute";
import AdminAuthenticatedRoute from "./components/Router/AdminAuthenticatedRoute";

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" component={vetted(ProposalListing)} exact={true} />
        <Route path="/about" component={About} />
        <Route path="/proposals/find" component={ProposalFind} />
        <Route path="/user/signup/next" component={SignupNext} />
        <Route path="/user/login" component={Login} />
        <Route path="/user/logout" component={Logout} />
        <Route path="/user/signup" component={LoginSignupPage} />
        <Route exact path="/user/forgotten/password" component={ForgottenPassword} />
        <Route exact path="/user/forgotten/password/next" component={ForgottenPasswordSuccess} />
        <Route exact path="/user/password/reset" component={PasswordReset} />
        <Route exact path="/user/password/reset/next" component={PasswordResetSuccess} />
        <Route path="/user/verify/success" component={VerifySuccess} />
        <Route path="/user/verify/failure" component={VerifyFailure} />
        <Route path="/user/verify" component={Verify} exact={true} />
        <Route path="/proposals/vetted" component={VettedProposals} />
        <AuthenticatedRoute path="/proposals/new" component={ProposalSubmit} />
        <AuthenticatedRoute path="/proposals/success" component={ProposalSubmitSuccess} />
        <AdminAuthenticatedRoute path="/proposals/:token/status" component={ProposalStatus} />
        <Route path="/proposals/:token" component={proposalDetail(ProposalDetail)} />
        <AdminAuthenticatedRoute path="/admin/censored" component={censored(ProposalListing)} />
        <AdminAuthenticatedRoute path="/admin/unreviewed" component={unreviewed(ProposalListing)} />
        <AdminAuthenticatedRoute path="/admin" component={admin(ProposalListing)} />
        <Route path="*" component={NotFound}/>
      </Switch>
    );
  }
}

export default Routes;
