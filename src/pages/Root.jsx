import React from "react";
import { Switch, withRouter } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import * as sel from "src/selectors";
import { useConfig } from "src/Config";
import { capitalize } from "src/utils/strings";
import {
  Route,
  AdminAuthenticatedRoute,
  AuthenticatedRoute,
  NotAuthenticatedRoute
} from "src/containers/Routes";
import PageNotFound from "./NotFound";
import PageProposalDetail from "./Proposals/Detail";
import PageProposalsPublicList from "./Proposals/PublicList";
import PageProposalsUnvetted from "./Proposals/UnvettedList";
import { renderEditRecordRoute, renderNewRecordRoute } from "./routeRenderers";
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

const Routes = ({ location }) => {
  const config = useConfig();
  const { recordType } = config;
  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Switch location={location}>
          <Route
            path="/"
            title="Public Proposals"
            exact
            component={PageProposalsPublicList}
          />
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

          {/* Record routes */}
          <AdminAuthenticatedRoute
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
            path={`/${recordType}/:token/edit`}
            title={`Edit ${capitalize(recordType)}`}
            exact
            render={renderEditRecordRoute(config)}
          />
          <Route title="Page Not Found" path="*" component={PageNotFound} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default withRouter(Routes);
