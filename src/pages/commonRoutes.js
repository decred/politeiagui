import React from "react";
import {
  Route,
  AdminAuthenticatedRoute,
  AuthenticatedRoute,
  NotAuthenticatedRoute
} from "src/containers/Routes";

import PageUserDetail from "./User/Detail";
import PageUserLogin from "./User/Login";
import PageUserPrivacyPolicy from "./User/PrivacyPolicy";
import PageUserRequestResendVerificationEmail from "./User/RequestResendVerificationEmail";
import PageUserRequestResetPassword from "./User/RequestResetPassword";
import PageUserResetPassword from "./User/ResetPassword";
import PageRequestPasswordMessage from "./User/ResetPasswordMessage";
import PageUserSearch from "./User/Search";
import PageUserSignup from "./User/Signup";
import PageUserVerifyEmail from "./User/VerifyEmail";
import PageUserVerifyKey from "./User/VerifyKey";

const commonRoutes = [
  <NotAuthenticatedRoute
    path="/user/login"
    title="Login"
    key="user-login-route"
    exact
    component={PageUserLogin}
  />,
  <NotAuthenticatedRoute
    path="/user/signup"
    title="Sign Up"
    key="sign-up-route"
    exact
    component={PageUserSignup}
  />,
  <NotAuthenticatedRoute
    path="/user/request-reset-password"
    title="Reset Password"
    exact
    key="request-reset-password-route"
    component={PageUserRequestResetPassword}
  />,
  <NotAuthenticatedRoute
    path="/user/reset-password-message"
    title="Reset Password"
    exact
    key="reset-password-message-route"
    component={PageRequestPasswordMessage}
  />,
  <NotAuthenticatedRoute
    path="/user/password/reset"
    exact
    key="reset-password-route"
    component={PageUserResetPassword}
  />,
  <AuthenticatedRoute
    path="/user/key/verify"
    exact
    key="user-key-verify-route"
    component={PageUserVerifyKey}
  />,
  <NotAuthenticatedRoute
    path="/user/resend-verification-email"
    title="Verification Email"
    exact
    key="resend-verification-email-route"
    component={PageUserRequestResendVerificationEmail}
  />,
  <NotAuthenticatedRoute
    path="/user/privacy-policy"
    title="Privacy Policy"
    exact
    key="privacy-policy-route"
    component={PageUserPrivacyPolicy}
  />,
  <NotAuthenticatedRoute
    path="/user/verify"
    exact
    key="user-verify-route"
    component={PageUserVerifyEmail}
  />,
  <AdminAuthenticatedRoute
    path="/user/search"
    title="Search User"
    exact
    key="search-user-route"
    component={PageUserSearch}
  />,
  <Route
    path="/user/:userid"
    title="User Detail"
    exact
    key="user-detail-route"
    component={PageUserDetail}
  />
];

export default commonRoutes;
