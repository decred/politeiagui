import * as sel from "../selectors";
import * as api from "../lib/api";

export const SET_EMAIL = "API_SET_EMAIL";
export const REQUEST_INIT_SESSION = "API_REQUEST_INIT_SESSION";
export const RECEIVE_INIT_SESSION = "API_RECEIVE_INIT_SESSION";
export const REQUEST_NEW_USER = "API_REQUEST_NEW_USER";
export const RECEIVE_NEW_USER = "API_RECEIVE_NEW_USER";
export const REQUEST_VERIFY_NEW_USER = "API_REQUEST_VERIFY_NEW_USER";
export const RECEIVE_VERIFY_NEW_USER = "API_RECEIVE_VERIFY_NEW_USER";
export const REQUEST_LOGIN = "API_REQUEST_LOGIN";
export const RECEIVE_LOGIN = "API_RECEIVE_LOGIN";
export const REQUEST_LOGOUT = "API_REQUEST_LOGOUT";
export const RECEIVE_LOGOUT = "API_RECEIVE_LOGOUT";
export const REQUEST_SECRET = "API_REQUEST_SECRET";
export const RECEIVE_SECRET = "API_RECEIVE_SECRET";

const basicAction = type =>
  (payload, error) => ({
    type,
    error: !!error,
    payload: error ? error : payload,
  });

const onRequestInitSession = basicAction(REQUEST_INIT_SESSION);
const onReceiveInitSession = basicAction(RECEIVE_INIT_SESSION);
const onRequestNewUser = basicAction(REQUEST_NEW_USER);
const onReceiveNewUser = basicAction(RECEIVE_NEW_USER);
const onRequestVerifyNewUser = basicAction(REQUEST_VERIFY_NEW_USER);
const onReceiveVerifyNewUser = basicAction(RECEIVE_VERIFY_NEW_USER);
const onRequestLogin = basicAction(REQUEST_LOGIN);
const onReceiveLogin = basicAction(RECEIVE_LOGIN);
const onRequestLogout = basicAction(REQUEST_LOGOUT);
const onReceiveLogout = basicAction(RECEIVE_LOGOUT);

export const onSetEmail = (payload) => ({ type: SET_EMAIL, payload });

export const onInit = () =>
  dispatch => {
    dispatch(onRequestInitSession());
    return api.apiInfo()
      .then(api => dispatch(onReceiveInitSession(api)))
      .catch(error => dispatch(onReceiveInitSession(null, error)));
  };

const withCsrf = fn =>
  (dispatch, getState) => {
    const csrf = sel.csrf(getState());
    return csrf
      ? fn(dispatch, getState, csrf)
      : dispatch(onInit()).then(() => withCsrf(fn)(dispatch, getState));
  };

export const onCreateNewUser = password =>
  withCsrf((dispatch, getState, csrf) => {
    const email = sel.email(getState());
    dispatch(onRequestNewUser({ email }));
    return api
      .newUser(csrf, email, password)
      .then(api => dispatch(onReceiveNewUser(api)))
      .catch(error => dispatch(onReceiveNewUser(null, error)));
  });

export const onVerifyNewUser = verificationtoken =>
  withCsrf((dispatch, getState, csrf) => {
    const email = sel.email(getState());
    dispatch(onRequestVerifyNewUser({ email, verificationtoken }));
    return api
      .verifyNewUser(csrf, email, verificationtoken)
      .then(api => dispatch(onReceiveVerifyNewUser(api)))
      .catch(error => dispatch(onReceiveVerifyNewUser(null, error)));
  });

export const onSignup = password =>
  (dispatch, getState) =>
    dispatch(onCreateNewUser(password))
      .then(() => {
        const state = getState();
        const verificationtoken = state.api.newUser.response.verificationtoken;
        return dispatch(onVerifyNewUser(verificationtoken))
          .then(() => dispatch(onLogin(password)));
      });

export const onLogin = password =>
  withCsrf((dispatch, getState, csrf) => {
    const email = sel.email(getState());
    dispatch(onRequestLogin({ email }));
    return api
      .login(csrf, email, password)
      .then(api => dispatch(onReceiveLogin(api)))
      .catch(error => dispatch(onReceiveLogin(null, error)));
  });

export const onLogout = () =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(onRequestLogout());
    return api
      .logout(csrf)
      .then(api => {
        dispatch(onReceiveLogout(api));
        dispatch(onSetEmail(""));
      })
      .catch(error => dispatch(onReceiveLogout(null, error)));
  });
