import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import {
  AuthenticatedRoute,
  AdminAuthenticatedRoute,
  NotAuthenticatedRoute
} from "src/containers/Routes";
import { useConfig } from "src/Config";

import PageUserLogin from "./User/Login";
import PageUserSignup from "./User/Signup";
import PageUserRequestResetPassword from "./User/RequestResetPassword";
import PageUserResetPassword from "./User/ResetPassword";
import PageUserRequestResendVerificationEmail from "./User/RequestResendVerificationEmail";
import PageUserPrivacyPolicy from "./User/PrivacyPolicy";
import PageUserVerifyEmail from "./User/VerifyEmail";
import PageUserDetail from "./User/Detail";
import PageUserSearch from "./User/Search";

import PageProposalsPublicList from "./Proposals/PublicList";
import PageProposalsUser from "./Proposals/User";
import PageProposalsAdmin from "./Proposals/Admin";
import PageProposalDetail from "./Proposals/Detail";
import PageProposalsUnvetted from "./Proposals/UnvettedList";

import PageNotFound from "./NotFound";

import { renderNewRecordRoute, renderEditRecordRoute } from "./routeRenderers";

const Routes = ({ location }) => {
  const config = useConfig();
  const { recordType } = config;
  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Switch location={location}>
          <Route path="/" exact component={PageProposalsPublicList} />
          <NotAuthenticatedRoute
            path="/user/login"
            exact
            component={PageUserLogin}
          />
          <NotAuthenticatedRoute
            path="/user/signup"
            exact
            component={PageUserSignup}
          />
          <NotAuthenticatedRoute
            path="/user/request-reset-password"
            exact
            component={PageUserRequestResetPassword}
          />
          <NotAuthenticatedRoute
            path="/user/reset-password"
            exact
            component={PageUserResetPassword}
          />
          <NotAuthenticatedRoute
            path="/user/resend-verification-email"
            exact
            component={PageUserRequestResendVerificationEmail}
          />
          <NotAuthenticatedRoute
            path="/user/privacy-policy"
            exact
            component={PageUserPrivacyPolicy}
          />
          <NotAuthenticatedRoute
            path="/user/verify-email"
            exact
            component={PageUserVerifyEmail}
          />
          <AdminAuthenticatedRoute
            path="/user/search"
            exact
            component={PageUserSearch}
          />
          <Route path="/user/:userid" exact component={PageUserDetail} />

          {/* Record routes */}
          <AdminAuthenticatedRoute
            path={`/${recordType}s/unvetted`}
            exact
            component={PageProposalsUnvetted}
          />
          <Route
            path={`/${recordType}/:token`}
            exact
            component={PageProposalDetail}
          />
          <Route
            path={`/${recordType}/:token/comments/:commentid`}
            exact
            component={PageProposalDetail}
          />
          <AuthenticatedRoute
            path={`/${recordType}s/user`}
            exact
            component={PageProposalsUser}
          />
          <Route
            path={`/${recordType}/:token/comments/:commentid`}
            exact
            component={PageProposalDetail}
          />
          <AuthenticatedRoute
            path={`/${recordType}/:token/edit`}
            exact
            render={renderEditRecordRoute(config)}
          />
          <AuthenticatedRoute
            path={`/${recordType}s/new`}
            exact
            render={renderNewRecordRoute(config)}
          />
          <AdminAuthenticatedRoute
            path={`/${recordType}s/admin`}
            exact
            component={PageProposalsAdmin}
          />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default withRouter(Routes);
