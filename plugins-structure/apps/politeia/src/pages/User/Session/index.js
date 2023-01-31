import { lazy } from "react";
import App from "../../../app";
import { routeCleanup } from "../../../utils/routeCleanup";
import { createRouteView } from "../../../utils/createRouteView";
import { serviceListeners as userListeners } from "@politeiagui/core/user/services";
import { serviceListeners as authListeners } from "@politeiagui/core/user/auth/services";

// Auth
const loginRoute = App.createRoute({
  path: "/user/login",
  title: "Login",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_login_page" */ "./Login"))
  ),
});

const signupRoute = App.createRoute({
  path: "/user/signup",
  title: "Sign Up",
  setupServices: [authListeners.signup],
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_signup_page" */ "./Signup"))
  ),
});

// Email
const emailResendRoute = App.createRoute({
  path: "/user/resend-verification-email",
  title: "Resend Verification Email",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() =>
      import(/* webpackChunkName: "user_resend_email_page" */ "./EmailResend")
    )
  ),
});
const emailVerifyRoute = App.createRoute({
  path: "/user/verify",
  title: "Verify Email",
  cleanup: routeCleanup,
  setupServices: [authListeners.verifyEmailOnLoad],
  view: createRouteView(
    lazy(() =>
      import(/* webpackChunkName: "user_verify_email_page" */ "./EmailVerify")
    )
  ),
});

// Password
const passwordResetRequestRoute = App.createRoute({
  path: "/user/password/request",
  title: "Request Password Reset",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() =>
      import(
        /* webpackChunkName: "user_pass_reset_request_page" */
        "./PasswordResetRequest"
      )
    )
  ),
});

const passwordResetRoute = App.createRoute({
  path: "/user/password/reset",
  title: "Password Reset",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() =>
      import(
        /* webpackChunkName: "user_pass_reset_request_page" */
        "./PasswordReset"
      )
    )
  ),
});

// Identity
const keyVerifyRoute = App.createRoute({
  path: "/user/key/verify",
  title: "Verify User Identity",
  cleanup: routeCleanup,
  setupServices: [userListeners.keyVerify],
  view: createRouteView(
    lazy(() =>
      import(
        /* webpackChunkName: "user_key_verify_page" */
        "./KeyVerify"
      )
    )
  ),
});

const routes = [
  loginRoute,
  signupRoute,
  emailResendRoute,
  emailVerifyRoute,
  keyVerifyRoute,
  passwordResetRequestRoute,
  passwordResetRoute,
];

export default routes;
