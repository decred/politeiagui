import * as sel from "../selectors";
import * as api from "../lib/api";
import { basicAction } from "./lib";

export const SET_EMAIL = "API_SET_EMAIL";
export const REQUEST_INIT_SESSION = "API_REQUEST_INIT_SESSION";
export const RECEIVE_INIT_SESSION = "API_RECEIVE_INIT_SESSION";
export const REQUEST_NEW_USER = "API_REQUEST_NEW_USER";
export const RECEIVE_NEW_USER = "API_RECEIVE_NEW_USER";
export const RESET_NEW_USER = "API_RESET_NEW_USER";
export const REQUEST_VERIFY_NEW_USER = "API_REQUEST_VERIFY_NEW_USER";
export const RECEIVE_VERIFY_NEW_USER = "API_RECEIVE_VERIFY_NEW_USER";
export const REQUEST_LOGIN = "API_REQUEST_LOGIN";
export const RECEIVE_LOGIN = "API_RECEIVE_LOGIN";
export const REQUEST_LOGOUT = "API_REQUEST_LOGOUT";
export const RECEIVE_LOGOUT = "API_RECEIVE_LOGOUT";
export const REQUEST_SECRET = "API_REQUEST_SECRET";
export const RECEIVE_SECRET = "API_RECEIVE_SECRET";
export const REQUEST_VETTED = "API_REQUEST_VETTED";
export const RECEIVE_VETTED = "API_RECEIVE_VETTED";
export const REQUEST_UNVETTED = "API_REQUEST_UNVETTED";
export const RECEIVE_UNVETTED = "API_RECEIVE_UNVETTED";
export const REQUEST_PROPOSAL = "API_REQUEST_PROPOSAL";
export const RECEIVE_PROPOSAL = "API_RECEIVE_PROPOSAL";
export const REQUEST_NEW_PROPOSAL = "API_REQUEST_NEW_PROPOSAL";
export const RECEIVE_NEW_PROPOSAL = "API_RECEIVE_NEW_PROPOSAL";

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
const onRequestVetted = basicAction(REQUEST_VETTED);
const onReceiveVetted = basicAction(RECEIVE_VETTED);
const onRequestUnvetted = basicAction(REQUEST_UNVETTED);
const onReceiveUnvetted = basicAction(RECEIVE_UNVETTED);
const onRequestProposal = basicAction(REQUEST_PROPOSAL);
const onReceiveProposal = basicAction(RECEIVE_PROPOSAL);
export const onRequestNewProposal = basicAction(REQUEST_NEW_PROPOSAL);
const onReceiveNewProposal = basicAction(RECEIVE_NEW_PROPOSAL);

export const onSetEmail = (payload) => ({ type: SET_EMAIL, payload });

export const onInit = () =>
  dispatch => {
    dispatch(onRequestInitSession());
    return api.apiInfo()
      .then(response => dispatch(onReceiveInitSession(response)))
      .catch(error => {
        dispatch(onReceiveInitSession(null, error));
        throw error;
      });
  };

export const withCsrf = fn =>
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
      .then(response => dispatch(onReceiveNewUser(response)))
      .catch(error => dispatch(onReceiveNewUser(null, error)));
  });

export const onResetNewUser = () => ({ type: RESET_NEW_USER });

export const onVerifyNewUser = verificationtoken =>
  withCsrf((dispatch, getState, csrf) => {
    const email = sel.email(getState());
    dispatch(onRequestVerifyNewUser({ email, verificationtoken }));
    return api
      .verifyNewUser(csrf, email, verificationtoken)
      .then(response => dispatch(onReceiveVerifyNewUser(response)))
      .catch(error => dispatch(onReceiveVerifyNewUser(null, error)));
  });

export const onSignup = password =>
  (dispatch) =>
    dispatch(onCreateNewUser(password));

export const onLogin = ({ email, password }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(onRequestLogin({ email }));
    return api
      .login(csrf, email, password)
      .then(response => dispatch(onReceiveLogin(response)))
      .catch(error => dispatch(onReceiveLogin(null, error)));
  });

export const onLogout = () =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(onRequestLogout());
    return api
      .logout(csrf)
      .then(response => {
        dispatch(onReceiveLogout(response));
        dispatch(onSetEmail(""));
      })
      .catch(error => dispatch(onReceiveLogout(null, error)));
  });

export const onFetchVetted = () =>
  (dispatch) => {
    dispatch(onRequestVetted());
    return api
      .vetted()
      .then(response => dispatch(onReceiveVetted(response)))
      .catch(error => dispatch(onReceiveVetted(null, error)));
  };

export const onFetchUnvetted = () =>
  (dispatch) => {
    dispatch(onRequestUnvetted());
    return api
      .unvetted()
      .then(response => dispatch(onReceiveUnvetted(response)))
      .catch(error => dispatch(onReceiveUnvetted(null, error)));
  };

export const onFetchProposal = (token) =>
  (dispatch) => {
    dispatch(onRequestProposal(token));
    return api
      .proposal(token)
      .then(response => dispatch(onReceiveProposal(response)))
      .catch(error => dispatch(onReceiveProposal(null, error)));
  };

export const onSubmitProposal = (name, description) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(onRequestNewProposal({ name, description }));
    return api
      .newProposal(csrf, name, description)
      .then(response => dispatch(onReceiveNewProposal(response)))
      .catch(error => {
        dispatch(onReceiveLogout(null, error));
        throw error;
      });
  });
