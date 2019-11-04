import React, { useEffect } from "react";
import { Switch, withRouter } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useLoaderContext } from "src/containers/Loader";
// import * as sel from "src/selectors";
import {
  Route,
  AdminAuthenticatedRoute,
  AuthenticatedRoute,
  NotAuthenticatedRoute
} from "src/containers/Routes";
import PageNotFound from "./NotFound";
import PageUserDetail from "./User/Detail";
import PageUserLogin from "./User/Login";
import PageUserPrivacyPolicy from "./User/PrivacyPolicy";
import PageUserRequestResendVerificationEmail from "./User/RequestResendVerificationEmail";
import PageUserRequestResetPassword from "./User/RequestResetPassword";
import PageUserResetPassword from "./User/ResetPassword";
import PageUserSearch from "./User/Search";
import PageUserSignup from "./User/Signup";
import PageUserVerifyEmail from "./User/VerifyEmail";
import PageUserVerifyKey from "./User/VerifyKey";

import PageListUserInvoices from "./Invoices/UserList";
import PageInvoicesNew from "./Invoices/New";

const Redirect = withRouter(({ to, history, location }) => {
  useEffect(() => {
    if (location.pathname !== to) {
      history.push(to);
    }
  }, [history, location.pathname]);
  return null;
});

const Routes = ({ location }) => {
  const { currentUser } = useLoaderContext();
  const loggedIn = !!currentUser;
  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Switch location={location}>
          <Route exact path="/">
            {loggedIn ? (
              <Redirect to="/invoices/me" />
            ) : (
              <Redirect to="/user/login" />
            )}
          </Route>
          <NotAuthenticatedRoute
            path="/user/login"
            title="Login"
            exact
            component={PageUserLogin}
          />
          <NotAuthenticatedRoute
            path="/user/signup"
            title="Sign Up"
            exact
            component={PageUserSignup}
          />
          <NotAuthenticatedRoute
            path="/user/request-reset-password"
            title="Reset Password"
            exact
            component={PageUserRequestResetPassword}
          />
          <NotAuthenticatedRoute
            path="/user/password/reset"
            exact
            component={PageUserResetPassword}
          />
          <AuthenticatedRoute
            path="/user/key/verify"
            exact
            component={PageUserVerifyKey}
          />
          <NotAuthenticatedRoute
            path="/user/resend-verification-email"
            title="Verification Email"
            exact
            component={PageUserRequestResendVerificationEmail}
          />
          <NotAuthenticatedRoute
            path="/user/privacy-policy"
            title="Privacy Policy"
            exact
            component={PageUserPrivacyPolicy}
          />
          <NotAuthenticatedRoute
            path="/user/verify"
            exact
            component={PageUserVerifyEmail}
          />
          <AdminAuthenticatedRoute
            path="/user/search"
            title="Search User"
            exact
            component={PageUserSearch}
          />
          <Route
            path="/user/:userid"
            title="User Detail"
            exact
            component={PageUserDetail}
          />

          <AuthenticatedRoute
            path="/invoices/me"
            title="My Invoices"
            exact
            component={PageListUserInvoices}
          />

          <AuthenticatedRoute
            path="/invoices/new"
            title="New Invoice"
            exact
            component={PageInvoicesNew}
          />

          {/* Record routes */}
          {/* <AdminAuthenticatedRoute
            path={`/${recordType}s/unvetted`}
            title={`Unvetted ${capitalize(recordType)}s`}
            exact
            component={PageProposalsUnvetted}
          />
          <AuthenticatedRoute
            path={`/${recordType}s/new`}
            title={`New ${capitalize(recordType)}`}
            exact
            render={renderNewRecordRoute(config)}
          />
          <Route
            path={`/${recordType}s/:token`}
            title={`${capitalize(recordType)} Detail`}
            titleSelector={sel.proposalName}
            exact
            component={PageProposalDetail}
          />
          <Route
            path={`/${recordType}s/:token/comments/:commentid`}
            title={`${capitalize(recordType)} Detail`}
            titleSelector={sel.proposalName}
            exact
            component={PageProposalDetail}
          />
          <AuthenticatedRoute
            path={`/${recordType}s/:token/edit`}
            title={`Edit ${capitalize(recordType)}`}
            exact
            render={renderEditRecordRoute(config)}
          />
          <AuthenticatedRoute
            path={`/${recordType}s/new`}
            title={`New ${capitalize(recordType)}`}
            exact
            render={renderNewRecordRoute(config)}
          />
          <AdminAuthenticatedRoute
            path={`/${recordType}s/admin`}
            title={`Admin ${capitalize(recordType)}s`}
            exact
            component={PageProposalsAdmin}
          /> */}
          <Route title="Page Not Found" path="*" component={PageNotFound} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default withRouter(Routes);
