import { lazy } from "react";
import App from "../../../app";
import { routeCleanup } from "../../../utils/routeCleanup";
import { createRouteView } from "../../../utils/createRouteView";

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
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() => import(/* webpackChunkName: "user_signup_page" */ "./Signup"))
  ),
});

const resendVerificationEmailRoute = App.createRoute({
  path: "/user/resend-verification-email",
  title: "Resend Verification Email",
  cleanup: routeCleanup,
  view: createRouteView(
    lazy(() =>
      import(/* webpackChunkName: "user_signup_page" */ "./EmailResend")
    )
  ),
});

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

const routes = [
  loginRoute,
  signupRoute,
  resendVerificationEmailRoute,
  passwordResetRequestRoute,
  passwordResetRoute,
];

export default routes;
