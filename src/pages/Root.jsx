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

import PageProposalsPublicList from "./Proposals/PublicList";
import PageProposalsUser from "./Proposals/User";
import PageProposalsAdmin from "./Proposals/Admin";
import PageProposalDetail from "./Proposals/Detail";

import PageNotFound from "./NotFound";

import { renderNewRecordRoute } from "./routeRenderers";

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
          <Route path="/user/:userid" exact component={PageUserDetail} />

          {/* Record routes */}
          <Route path="/proposal/:token" exact component={PageProposalDetail} />
          <AuthenticatedRoute
            path={`/${recordType}s/user`}
            exact
            component={PageProposalsUser}
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
