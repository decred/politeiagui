import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { SubmitPage, LoginSignupPage, Content as ProposalListing } from "./components/snew";
import vetted from "./connectors/proposals";
import userDetail from "./connectors/user";
import proposalDetail from "./connectors/proposal";
import censored from "./connectors/censoredProposals";
import unreviewed from "./connectors/unreviewedProposals";
import admin from "./connectors/admin";

import Logout from "./components/LogoutPage";
import SignupNext from "./components/SignupNextStepPage";
import ForgottenPassword from "./components/ForgottenPasswordPage";
import ForgottenPasswordSuccess from "./components/ForgottenPassword/SuccessPage";
import PasswordReset from "./components/PasswordResetPage";
import PasswordResetSuccess from "./components/PasswordReset/SuccessPage";
import ResendVerificationEmail from "./components/ResendVerificationEmailPage";
import ResendVerificationEmailSuccess from "./components/ResendVerificationEmail/SuccessPage";
import Verify from "./components/Verify";
import UserProposals from "./components/UserProposals";
import Account from "./components/AccountPage";
import VerifyKey from "./components/VerifyKey";
import NotFound from "./components/NotFoundPage";
import ErrorPage from "./components/ErrorPage/";
import ProposalDetail from "./components/ProposalDetail";
import UserDetail from "./components/UserDetail";
import AuthenticatedRoute from "./components/Router/AuthenticatedRoute";
import AdminAuthenticatedRoute from "./components/Router/AdminAuthenticatedRoute";

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/" component={vetted(ProposalListing)} exact />
        <Route path="/login" component={LoginSignupPage} />
        <Route path="/user/login" component={LoginSignupPage} />
        <Route path="/user/logout" component={Logout} />
        <Route path="/user/signup/next" component={SignupNext} />
        <Route path="/user/signup" component={LoginSignupPage} />
        <AuthenticatedRoute path="/user/proposals/:filter?" component={UserProposals} />
        <Route exact path="/password" component={ForgottenPassword} />
        <Route exact path="/user/forgotten/password" component={ForgottenPassword} />
        <Route exact path="/user/forgotten/password/next" component={ForgottenPasswordSuccess} />
        <Route exact path="/user/password/reset" component={PasswordReset} />
        <Route exact path="/user/password/reset/next" component={PasswordResetSuccess} />
        <Route path="/user/verify" component={Verify} exact />
        <Route path="/user/key/verify" component={VerifyKey} exact />
        <Route path="/user/resend" component={ResendVerificationEmail} exact />
        <Route path="/user/resend/next" component={ResendVerificationEmailSuccess} />
        <AuthenticatedRoute path="/user/account" component={Account} exact />
        <AuthenticatedRoute path="/proposals/new/:draftname" component={SubmitPage} />
        <AuthenticatedRoute path="/proposals/new" component={SubmitPage} />
        <AdminAuthenticatedRoute path="/admin/censored" component={censored(ProposalListing)} />
        <AdminAuthenticatedRoute path="/admin/unreviewed" component={unreviewed(ProposalListing)} />
        <AdminAuthenticatedRoute path="/admin" component={admin(ProposalListing)} />
        <AdminAuthenticatedRoute path="/user/:userId" component={userDetail(UserDetail)} />
        <Route path="/proposals/:token" component={proposalDetail(ProposalDetail)} />
        <Route path="/500" component={ErrorPage} />
        <Route path="*" component={NotFound} />
      </Switch>
    );
  }
}

export default Routes;
