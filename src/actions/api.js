import Promise from "promise";
import * as sel from "../selectors";
import * as api from "../lib/api";
import act from "./methods";

export const onResetProposal = act.RESET_PROPOSAL;
export const onSetEmail = act.SET_EMAIL;

export const onInit = () => dispatch => {
  dispatch(act.REQUEST_ME());
  return api
    .me()
    .then(response => {
      dispatch(act.RECEIVE_ME(response));
      dispatch(act.REQUEST_INIT_SESSION());
      return api
        .apiInfo()
        .then(response => dispatch(act.RECEIVE_INIT_SESSION(response)))
        .catch(error => {
          dispatch(act.RECEIVE_INIT_SESSION(null, error));
          throw error;
        });
    })
    .catch(() => {
      dispatch(act.REQUEST_INIT_SESSION());
      return api
        .apiInfo()
        .then(response => dispatch(act.RECEIVE_INIT_SESSION(response)))
        .catch(error => {
          dispatch(act.RECEIVE_INIT_SESSION(null, error));
          throw error;
        });
    });
};

export const onRouteChange = () => dispatch => {
  dispatch(act.CLEAN_ERRORS());
};

export const onGetPolicy = () => dispatch => {
  dispatch(act.REQUEST_POLICY());
  return api
    .policy()
    .then(response => dispatch(act.RECEIVE_POLICY(response)))
    .catch(error => {
      dispatch(act.RECEIVE_POLICY(null, error));
      throw error;
    });
};

export const withCsrf = fn => (dispatch, getState) => {
  const csrf = sel.csrf(getState());
  return csrf
    ? fn(dispatch, getState, csrf)
    : dispatch(onInit()).then(() => withCsrf(fn)(dispatch, getState));
};

export const onCreateNewUser = ({ email, password }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_NEW_USER({ email }));
    return api
      .newUser(csrf, email, password)
      .then(response => dispatch(act.RECEIVE_NEW_USER(response)))
      .catch(error => {
        dispatch(act.RECEIVE_NEW_USER(null, error));
        throw error;
      });
  });

export const onResetNewUser = act.RESET_NEW_USER;

export const onVerifyNewUser = searchQuery => dispatch => {
  dispatch(act.REQUEST_VERIFY_NEW_USER(searchQuery));
  return api
    .verifyNewUser(searchQuery)
    .then(res => dispatch(act.RECEIVE_VERIFY_NEW_USER(res)))
    .catch(err => {
      dispatch(act.RECEIVE_VERIFY_NEW_USER(null, err));
      throw err;
    });
};

export const onSignup = props => dispatch => dispatch(onCreateNewUser(props));

export const onLogin = ({ email, password }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_LOGIN({ email }));
    return api
      .login(csrf, email, password)
      .then(response => dispatch(act.RECEIVE_LOGIN(response)))
      .then(() => dispatch(onInit()))
      .catch(error => {
        dispatch(act.RECEIVE_LOGIN(null, error));
        throw error;
      });
  });

export const onLogout = () =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_LOGOUT());
    return api
      .logout(csrf)
      .then(response => {
        dispatch(act.RECEIVE_LOGOUT(response));
        dispatch(onSetEmail(""));
      })
      .catch(error => dispatch(act.RECEIVE_LOGOUT(null, error)));
  });

export const onChangePassword = (password, newPassword) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_CHANGE_PASSWORD());
    return api
      .changePassword(csrf, password, newPassword)
      .then(response => dispatch(act.RECEIVE_CHANGE_PASSWORD(response)))
      .catch(error => {
        dispatch(act.RECEIVE_CHANGE_PASSWORD(null, error));
        throw error;
      });
  });

export const onFetchVetted = () => dispatch => {
  dispatch(act.REQUEST_VETTED());
  return api
    .vetted()
    .then(response => dispatch(act.RECEIVE_VETTED(response)))
    .catch(error => dispatch(act.RECEIVE_VETTED(null, error)));
};

export const onFetchUnvetted = () => dispatch => {
  dispatch(act.REQUEST_UNVETTED());
  return api
    .unvetted()
    .then(response => dispatch(act.RECEIVE_UNVETTED(response)))
    .catch(error => dispatch(act.RECEIVE_UNVETTED(null, error)));
};

export const onFetchProposal = token => dispatch => {
  dispatch(act.REQUEST_PROPOSAL(token));
  return api
    .proposal(token)
    .then(response => dispatch(act.RECEIVE_PROPOSAL(response)))
    .catch(error => dispatch(act.RECEIVE_PROPOSAL(null, error)));
};

export const onFetchProposalComments = token => dispatch => {
  dispatch(act.REQUEST_PROPOSAL_COMMENTS(token));
  return api
    .proposalComments(token)
    .then(response => dispatch(act.RECEIVE_PROPOSAL_COMMENTS(response)))
    .catch(error => dispatch(act.RECEIVE_PROPOSAL_COMMENTS(null, error)));
};

export const onSubmitProposal = (loggedInAs, name, description, files) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_NEW_PROPOSAL({ name, description, files }));
    return Promise.resolve(api.makeProposal(name, description, files))
      .then(proposal => api.signProposal(loggedInAs, proposal)).then(proposal => api.newProposal(csrf, proposal))
      .then(proposal => dispatch(act.RECEIVE_NEW_PROPOSAL({ ...proposal, name, description })))
      .catch(error => { dispatch(act.RECEIVE_NEW_PROPOSAL(null, error)); throw error; });
  });

export const onSubmitComment = (loggedInAs, token, comment, parentid) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_NEW_COMMENT({ token, comment, parentid }));
    return Promise.resolve(api.makeComment(token, comment, parentid))
      .then(comment => api.signComment(loggedInAs, comment))
      .then(comment => api.newComment(csrf, comment))
      .then(response => dispatch(act.RECEIVE_NEW_COMMENT(response)))
      .catch(error => {
        dispatch(act.RECEIVE_NEW_COMMENT(null, error));
        throw error;
      });
  });

const statusName = key => ({ 3: "censor", 4: "publish" }[key]);

export const onSubmitStatusProposal = (loggedInAs, token, status) =>
  window.confirm(`Are you sure you want to ${statusName(status)} this proposal?`)
    ?  withCsrf((dispatch, getState, csrf) => {
      dispatch(act.REQUEST_SETSTATUS_PROPOSAL({ status, token }));
      return api
        .proposalSetStatus(loggedInAs, csrf, token, status)
        .then(response => dispatch(act.RECEIVE_SETSTATUS_PROPOSAL(response)))
        .catch(error => dispatch(act.RECEIVE_SETSTATUS_PROPOSAL(null, error)));
    })
    : {type: "NOOP"};

export const redirectedFrom = location => dispatch =>
  dispatch(act.REDIRECTED_FROM(location));
export const resetRedirectedFrom = () => dispatch =>
  dispatch(act.RESET_REDIRECTED_FROM());

export const onForgottenPasswordRequest = ({ email }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_FORGOTTEN_PASSWORD_REQUEST({ email }));
    return api
      .forgottenPasswordRequest(csrf, email)
      .then(response =>
        dispatch(act.RECEIVE_FORGOTTEN_PASSWORD_REQUEST(response))
      )
      .catch(error => {
        dispatch(act.RECEIVE_FORGOTTEN_PASSWORD_REQUEST(null, error));
        throw error;
      });
  });

export const resetForgottenPassword = () => dispatch =>
  dispatch(act.RESET_FORGOTTEN_PASSWORD_REQUEST());

export const onPasswordResetRequest = ({
  email,
  verificationtoken,
  password
}) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(
      act.REQUEST_PASSWORD_RESET_REQUEST({ email, verificationtoken, password })
    );
    return api
      .passwordResetRequest(csrf, email, verificationtoken, password)
      .then(response => dispatch(act.RECEIVE_PASSWORD_RESET_REQUEST(response)))
      .catch(error => {
        dispatch(act.RECEIVE_PASSWORD_RESET_REQUEST(null, error));
        throw error;
      });
  });

export const resetPasswordReset = () => dispatch =>
  dispatch(act.RESET_PASSWORD_RESET_REQUEST);
