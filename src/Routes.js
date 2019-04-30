import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import {
  SubmitPage,
  LoginSignupPage,
  Content as ProposalListing
} from "./components/snew";

// POLITEIA CONNECTORS
import userDetail from "./connectors/user";
import proposalDetail from "./connectors/proposal";
import censored from "./connectors/censoredProposals";
import unreviewed from "./connectors/unreviewedProposals";
import admin from "./connectors/admin";
import newProposal from "./connectors/newProposal";
import editProposal from "./connectors/editProposal";
import routesConnector from "./connectors/routes";

// POLITEIA ROUTES
import Logout from "./components/LogoutPage";
import UserLookup from "./components/UserLookupPage";
import SignupNext from "./components/SignupNextStepPage";
import ForgottenPassword from "./components/ForgottenPasswordPage";
import ForgottenPasswordSuccess from "./components/ForgottenPassword/SuccessPage";
import PasswordReset from "./components/PasswordResetPage";
import PasswordResetSuccess from "./components/PasswordReset/SuccessPage";
import ResendVerificationEmail from "./components/ResendVerificationEmailPage";
import ResendVerificationEmailSuccess from "./components/ResendVerificationEmail/SuccessPage";
import Verify from "./components/Verify";
import UserProposals from "./components/UserProposals";
import VerifyKey from "./components/VerifyKey";
import NotFound from "./components/NotFoundPage";
import ErrorPage from "./components/ErrorPage/";
import ProposalDetail from "./components/RecordDetail";
import UserDetail from "./components/UserDetail";
import AuthenticatedRoute from "./components/Router/AuthenticatedRoute";
import AdminAuthenticatedRoute from "./components/Router/AdminAuthenticatedRoute";
import PublicProposalsPage from "./components/PublicProposalsPage/PublicProposalsPage";
import PrivacyPolicy from "./components/snew/PrivacyPolicy";

// CMS CONNECTORS
import adminCMS from "./connectors/adminCMS";
import invoiceDetail from "./connectors/invoice";
import newInvoice from "./hocs/newInvoice";
import editInvoice from "./hocs/editInvoice";

// CMS ROUTES
import UserInvoices from "./components/UserInvoices";
import InviteUser from "./components/InviteUserPage";
import InviteUserSuccess from "./components/InviteUser/SuccessPage";
import HomeCMS from "./components/HomeCMS";
import GeneratePayouts from "./components/GeneratePayouts";

const RoutesForCMS = () => {
  return (
    <Switch>
      <AuthenticatedRoute path="/" component={HomeCMS} exact />
      <Route path="/login" component={LoginSignupPage} />
      <Route path="/register" component={LoginSignupPage} />
      <Route path="/user/login" component={LoginSignupPage} />
      <Route path="/user/logout" component={Logout} />
      <Route path="/user/signup/next" component={SignupNext} />
      <Route path="/user/signup" component={LoginSignupPage} />
      <Route exact path="/password" component={ForgottenPassword} />
      <Route
        exact
        path="/user/forgotten/password"
        component={ForgottenPassword}
      />
      <Route
        exact
        path="/user/forgotten/password/next"
        component={ForgottenPasswordSuccess}
      />
      <Route exact path="/user/password/reset" component={PasswordReset} />
      <Route
        exact
        path="/user/password/reset/next"
        component={PasswordResetSuccess}
      />
      <Route path="/user/verify" component={Verify} exact />
      <Route path="/user/key/verify" component={VerifyKey} exact />
      <Route path="/user/resend" component={ResendVerificationEmail} exact />
      <Route
        path="/user/resend/next"
        component={ResendVerificationEmailSuccess}
      />
      <Route path="/privacy-policy/" component={PrivacyPolicy} />
      <AdminAuthenticatedRoute
        path="/admin"
        component={adminCMS(ProposalListing)}
        exact
      />
      <AdminAuthenticatedRoute path="/admin/users" component={UserLookup} />
      <AdminAuthenticatedRoute
        path="/admin/payouts"
        component={GeneratePayouts}
      />
      <AuthenticatedRoute
        path="/user/invoices/:filter?"
        component={UserInvoices}
        exact
      />
      <Route
        path="/user/:userId/:filter?"
        component={userDetail(UserDetail)}
        exact
      />
      <AuthenticatedRoute
        path="/invoices/new"
        component={newInvoice(SubmitPage)}
        exact
      />
      <AuthenticatedRoute
        path="/invoices/:token/edit"
        component={editInvoice(SubmitPage)}
      />
      <Route
        path="/invoices/:token"
        component={invoiceDetail(ProposalDetail)}
        exact
      />
      <Route
        path="/invoices/:token/comments/:commentid"
        component={invoiceDetail(ProposalDetail)}
      />
      <AdminAuthenticatedRoute
        path="/admin/invite"
        component={adminCMS(InviteUser)}
        exact
      />
      <AdminAuthenticatedRoute
        path="/admin/invite/next"
        component={adminCMS(InviteUserSuccess)}
        exact
      />
      <Route path="/500" component={ErrorPage} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

const RoutesForPoliteia = () => {
  return (
    <Switch>
      <Route path="/" component={PublicProposalsPage} exact />
      <Route path="/login" component={LoginSignupPage} />
      <Route path="/user/login" component={LoginSignupPage} />
      <Route path="/user/logout" component={Logout} />
      <Route path="/user/signup/next" component={SignupNext} />
      <Route path="/user/signup" component={LoginSignupPage} />
      <AuthenticatedRoute
        path="/user/proposals/:filter?"
        component={UserProposals}
      />
      <Route exact path="/password" component={ForgottenPassword} />
      <Route
        exact
        path="/user/forgotten/password"
        component={ForgottenPassword}
      />
      <Route
        exact
        path="/user/forgotten/password/next"
        component={ForgottenPasswordSuccess}
      />
      <Route exact path="/user/password/reset" component={PasswordReset} />
      <Route
        exact
        path="/user/password/reset/next"
        component={PasswordResetSuccess}
      />
      <Route path="/user/verify" component={Verify} exact />
      <Route path="/user/key/verify" component={VerifyKey} exact />
      <Route path="/user/resend" component={ResendVerificationEmail} exact />
      <Route
        path="/user/resend/next"
        component={ResendVerificationEmailSuccess}
      />
      <Route path="/privacy-policy/" component={PrivacyPolicy} />
      <AdminAuthenticatedRoute
        path="/admin"
        component={admin(ProposalListing)}
        exact
      />
      <AdminAuthenticatedRoute path="/admin/users" component={UserLookup} />
      <Route path="/user/:userId/:filter?" component={userDetail(UserDetail)} />
      <AuthenticatedRoute
        path="/proposals/new"
        component={newProposal(SubmitPage)}
      />
      <AuthenticatedRoute
        path="/proposals/:token/edit"
        component={editProposal(SubmitPage)}
      />
      <AdminAuthenticatedRoute
        path="/admin/censored"
        component={censored(ProposalListing)}
      />
      <AdminAuthenticatedRoute
        path="/admin/unreviewed"
        component={unreviewed(ProposalListing)}
      />
      <Route
        path="/proposals/:token"
        component={proposalDetail(ProposalDetail)}
        exact
      />
      <Route
        path="/proposals/:token/comments/:commentid"
        component={proposalDetail(ProposalDetail)}
      />
      <Route path="/500" component={ErrorPage} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
};

class Routes extends Component {
  render() {
    return this.props.isCMS ? <RoutesForCMS /> : <RoutesForPoliteia />;
  }
}

export default routesConnector(Routes);
