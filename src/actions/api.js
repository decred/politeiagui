import Promise from "promise";
import * as sel from "../selectors";
import * as api from "../lib/api";
import { confirmWithModal } from "./modal";
import * as external_api_actions from "./external_api";
import act from "./methods";

export const onResetProposal = act.RESET_PROPOSAL;
export const onSetEmail = act.SET_EMAIL;

export const onInit = () => (dispatch, getState) => {
  dispatch(act.REQUEST_ME());
  return api
    .me()
    .then(response => {
      dispatch(act.RECEIVE_ME(response));
      dispatch(act.REQUEST_INIT_SESSION());
      return api
        .apiInfo()
        .then(response => dispatch(act.RECEIVE_INIT_SESSION(response)))
        .then(() => {
          // Start polling for the user paywall tx, if applicable.
          const paywallAddress = sel.paywallAddress(getState());
          if(paywallAddress) {
            const paywallAmount = sel.paywallAmount(getState());
            const paywallTxNotBefore = sel.paywallTxNotBefore(getState());
            dispatch(external_api_actions.verifyUserPayment(paywallAddress, paywallAmount, paywallTxNotBefore));
          }
        })
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

export const updateMe = (payload) => dispatch => dispatch(act.UPDATE_ME(payload));

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

export const onFetchUserProposals = userid => dispatch => {
  dispatch(act.REQUEST_USER_PROPOSALS());
  return api
    .userProposals(userid)
    .then(response => dispatch(act.RECEIVE_USER_PROPOSALS(response)))
    .catch(error => dispatch(act.RECEIVE_USER_PROPOSALS(null, error)));
};

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

export const onUpdateUserKey = (loggedInAs) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_UPDATED_KEY());
    api.updateKeyRequest(csrf, loggedInAs)
      .then(response => dispatch(act.RECEIVE_UPDATED_KEY({ ...response, success: true })))
      .catch(error => { dispatch(act.RECEIVE_UPDATED_KEY(null, error)); throw error; });
  });

export const onVerifyUserKey = (loggedInAs, verificationtoken) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_VERIFIED_KEY());
    api.verifyKeyRequest(csrf, loggedInAs, verificationtoken)
      .then(response => dispatch(act.RECEIVE_VERIFIED_KEY({ ...response, success: true })))
      .catch(error => dispatch(act.RECEIVE_VERIFIED_KEY(null, error)));
  });

export const onSubmitStatusProposal = (loggedInAs, token, status) =>
  withCsrf((dispatch, getState, csrf) => {
    return dispatch(confirmWithModal("CONFIRM_ACTION",
      { message: `Are you sure you want to ${statusName(status)} this proposal?` }))
      .then(
        (confirm) => {
          if (confirm) {
            dispatch(act.REQUEST_SETSTATUS_PROPOSAL({ status, token }));
            if(status === 4) {
              dispatch(act.SET_PROPOSAL_APPROVED(true));
            }
            return api
              .proposalSetStatus(loggedInAs, csrf, token, status)
              .then(response => dispatch(act.RECEIVE_SETSTATUS_PROPOSAL(response)))
              .catch(error => dispatch(act.RECEIVE_SETSTATUS_PROPOSAL(null, error)));
          }
        }
      );
  });


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

export const keyMismatch = (payload) => dispatch => dispatch(act.KEY_MISMATCH(payload));

export const resetPasswordReset = () => dispatch =>
  dispatch(act.RESET_PASSWORD_RESET_REQUEST);

export const verifyUserPaymentWithPoliteia = (dispatch, txid) => {
  return api.verifyUserPayment(txid)
    .then(response => {
      return response.haspaid;
    });
};

export const onFetchActiveVotes = () => (dispatch) => {
  dispatch(act.REQUEST_ACTIVE_VOTES());
  return api.activeVotes().then(
    response => dispatch(act.RECEIVE_ACTIVE_VOTES({ ...response, success: true }))
  ).catch(
    error => dispatch(act.RECEIVE_ACTIVE_VOTES(null, error))
  );
};

export const onStartVote = (loggedInAs, token, status) =>
  withCsrf((dispatch, getState, csrf) => {
    return dispatch(confirmWithModal("CONFIRM_ACTION",
      { message: "Are you sure you want to start voting this proposal?" }))
      .then(
        (confirm) => {
          if (confirm) {
            dispatch(act.REQUEST_START_VOTE({token, status}));
            return api
              .startVote(loggedInAs, csrf, token, status)
              .then(response => {
                dispatch(act.RECEIVE_START_VOTE({...response, success: true}));
                dispatch(onFetchActiveVotes());
              })
              .catch(error => dispatch(act.RECEIVE_START_VOTE(null, error)));
          }
        }
      );
  });


export const onFetchVoteResults = (vote) => (dispatch) => {
  dispatch(act.REQUEST_VOTE_RESULTS({ vote }));
  return api.voteResults({ vote }).then(
    response => dispatch(act.RECEIVE_VOTE_RESULTS({ ...response, success: true }))
  ).catch(
    error => dispatch(act.RECEIVE_VOTE_RESULTS(null, error))
  );
};
