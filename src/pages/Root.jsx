import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useConfig } from "src/Config";
import {
  AdminAuthenticatedRoute,
  AuthenticatedRoute,
  NotAuthenticatedRoute
} from "src/containers/Routes";
import PageNotFound from "./NotFound";
import PageProposalsAdmin from "./Proposals/Admin";
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
            exact
            component={PageUserRequestResendVerificationEmail}
          />
          <NotAuthenticatedRoute
            path="/user/privacy-policy"
            exact
            component={PageUserPrivacyPolicy}
          />
          <NotAuthenticatedRoute
            path="/user/verify"
            exact
            component={PageUserVerifyEmail}
          />
          <AdminAuthenticatedRoute
            path={"/user/search"}
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
