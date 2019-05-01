import Promise from "promise";
import * as sel from "../selectors";
import * as api from "../lib/api";
import * as pki from "../lib/pki";
import { confirmWithModal, openModal, closeModal } from "./modal";
import * as modalTypes from "../components/Modal/modalTypes";
import * as external_api_actions from "./external_api";
import { clearStateLocalStorage } from "../lib/local_storage";
import { callAfterMinimumWait } from "./lib";
import { resetNewProposalData } from "../lib/editors_content_backup";
import act from "./methods";

export const onResetProposal = act.RESET_PROPOSAL;
export const onResetInvoice = act.RESET_INVOICE;

export const onSetEmail = act.SET_EMAIL;

export const onSignup = act.REQUEST_SIGNUP_CONFIRMATION;
export const onResetSignup = act.RESET_SIGNUP_CONFIRMATION;
export const onResetRescanUserPayments = act.RESET_RESCAN_USER_PAYMENTS;
export const onSignupConfirm = (props, isCMS) => dispatch => {
  if (isCMS) {
    dispatch(onCreateNewUserCMS(props));
  } else {
    dispatch(onCreateNewUser(props));
  }
};

export const requestApiInfo = () => dispatch => {
  dispatch(act.REQUEST_INIT_SESSION());
  return api
    .apiInfo()
    .then(response => {
      dispatch(act.RECEIVE_INIT_SESSION(response));
      if (response.activeusersession) {
        dispatch(onRequestMe());
      }
    })
    .catch(error => {
      dispatch(act.RECEIVE_INIT_SESSION(null, error));
    });
};

export const onRequestMe = () => (dispatch, getState) => {
  dispatch(act.REQUEST_ME());
  return api
    .me()
    .then(response => {
      dispatch(act.RECEIVE_ME(response));
      if (sel.usePaywall(getState())) {
        dispatch(act.SET_PROPOSAL_CREDITS(response.proposalcredits));

        // Start polling for the user paywall tx, if applicable.
        const paywallAddress = sel.paywallAddress(getState());
        if (paywallAddress) {
          const paywallAmount = sel.paywallAmount(getState());
          const paywallTxNotBefore = sel.paywallTxNotBefore(getState());
          dispatch(
            external_api_actions.verifyUserPayment(
              paywallAddress,
              paywallAmount,
              paywallTxNotBefore
            )
          );
        }
      }
    })
    .catch(error => {
      dispatch(act.RECEIVE_ME(null, error));
      clearStateLocalStorage();
    });
};

export const updateMe = payload => dispatch => dispatch(act.UPDATE_ME(payload));

export const cleanErrors = act.CLEAN_ERRORS;

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
  const csrfIsNeeded = sel.getCsrfIsNeeded(getState());
  if (csrf || csrfIsNeeded) return fn(dispatch, getState, csrf);

  dispatch(act.CSRF_NEEDED(true));
  return dispatch(requestApiInfo()).then(() =>
    withCsrf(fn)(dispatch, getState)
  );
};

export const onInviteUserConfirm = ({ email }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_INVITE_USER({ email }));
    return api
      .inviteNewUser(csrf, email)
      .then(response => {
        dispatch(act.RECEIVE_INVITE_USER(response));
        dispatch(closeModal());
      })
      .catch(error => {
        if (error.toString() === "Error: No available storage method found.") {
          //local storage error
          dispatch(
            act.RECEIVE_INVITE_USER(
              null,
              new Error("CMS requires local storage to work.")
            )
          );
        } else {
          dispatch(act.RECEIVE_INVITE_USER(null, error));
        }
        throw error;
      });
  });

export const onCreateNewUser = ({ email, username, password }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_NEW_USER({ email }));
    return api
      .newUser(csrf, email, username, password)
      .then(response => {
        dispatch(act.RECEIVE_NEW_USER(response));
        dispatch(closeModal());
      })
      .catch(error => {
        if (error.toString() === "Error: No available storage method found.") {
          //local storage error
          dispatch(
            act.RECEIVE_NEW_USER(
              null,
              new Error("Politeia requires local storage to work.")
            )
          );
        } else {
          dispatch(act.RECEIVE_NEW_USER(null, error));
        }
        throw error;
      });
  });

export const onCreateNewUserCMS = ({
  email,
  username,
  password,
  verificationtoken
}) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_NEW_USER({ email }));
    return api
      .register(csrf, email, username, password, verificationtoken)
      .then(response => {
        dispatch(act.RECEIVE_NEW_USER(response));
        dispatch(closeModal());
      })
      .catch(error => {
        if (error.toString() === "Error: No available storage method found.") {
          //local storage error
          dispatch(
            act.RECEIVE_NEW_USER(
              null,
              new Error("CMS requires local storage to work.")
            )
          );
        } else {
          dispatch(act.RECEIVE_NEW_USER(null, error));
        }
        throw error;
      });
  });

export const onResetNewUser = act.RESET_NEW_USER;

export const onVerifyNewUser = (email, verificationToken) => dispatch => {
  dispatch(act.REQUEST_VERIFY_NEW_USER({ email, verificationToken }));
  return api
    .verifyNewUser(email, verificationToken)
    .then(res => dispatch(act.RECEIVE_VERIFY_NEW_USER(res)))
    .catch(err => {
      dispatch(act.RECEIVE_VERIFY_NEW_USER(null, err));
      throw err;
    });
};

export const onSearchUser = query => dispatch => {
  dispatch(act.REQUEST_USER_SEARCH());
  return api
    .searchUser(query)
    .then(res => dispatch(act.RECEIVE_USER_SEARCH(res)))
    .catch(err => {
      dispatch(act.RECEIVE_USER_SEARCH(null, err));
      throw err;
    });
};

export const onLogin = ({ email, password }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_LOGIN({ email }));
    return api
      .login(csrf, email, password)
      .then(response => {
        dispatch(act.RECEIVE_LOGIN(response));
        if (sel.usePaywall(getState())) {
          dispatch(act.SET_PROPOSAL_CREDITS(response.proposalcredits));
        }
        dispatch(closeModal());
      })
      .then(() => dispatch(onRequestMe()))
      .catch(error => {
        dispatch(act.RECEIVE_LOGIN(null, error));
        throw error;
      });
  });

// handleLogout handles all the procedure to be done once the user is logged out
// it can be called either when the logout request has been successful or when the
// session has already expired
export const handleLogout = response => dispatch => {
  dispatch(act.RECEIVE_LOGOUT(response));
  clearStateLocalStorage();
  external_api_actions.clearPollingPointer();
  dispatch(onSetEmail(""));
};

export const onLogout = () =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_LOGOUT());
    return api
      .logout(csrf)
      .then(response => {
        dispatch(handleLogout(response));
      })
      .catch(error => {
        dispatch(act.RECEIVE_LOGOUT(null, error));
      });
  });

export const onChangeUsername = (password, newUsername) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_CHANGE_USERNAME());
    return api
      .changeUsername(csrf, password, newUsername)
      .then(response =>
        dispatch(
          act.RECEIVE_CHANGE_USERNAME({ ...response, username: newUsername })
        )
      )
      .catch(error => {
        dispatch(act.RECEIVE_CHANGE_USERNAME(null, error));
        throw error;
      });
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

export const onFetchUserProposals = (userid, token) => dispatch => {
  dispatch(act.REQUEST_USER_PROPOSALS());
  return api
    .userProposals(userid, token)
    .then(response => dispatch(act.RECEIVE_USER_PROPOSALS(response)))
    .catch(error => {
      dispatch(act.RECEIVE_USER_PROPOSALS(null, error));
    });
};

export const onFetchUserInvoices = (userid, token) => dispatch => {
  dispatch(act.REQUEST_USER_INVOICES());
  return api
    .userInvoices(userid, token)
    .then(response => dispatch(act.RECEIVE_USER_INVOICES(response)))
    .catch(error => {
      dispatch(act.RECEIVE_USER_INVOICES(null, error));
    });
};

export const onFetchInvoiceComments = token => dispatch => {
  dispatch(act.REQUEST_INVOICE_COMMENTS());
  return api
    .invoiceComments(token)
    .then(response => {
      dispatch(act.RECEIVE_INVOICE_COMMENTS(response));
    })
    .catch(error => {
      dispatch(act.RECEIVE_INVOICE_COMMENTS(null, error));
    });
};

export const onFetchAdminInvoices = () =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_ADMIN_INVOICES());
    return api
      .adminInvoices(csrf)
      .then(response => dispatch(act.RECEIVE_ADMIN_INVOICES(response)))
      .catch(error => {
        dispatch(act.RECEIVE_ADMIN_INVOICES(null, error));
      });
  });

export const onFetchVetted = token => dispatch => {
  dispatch(act.REQUEST_VETTED());
  return api
    .vetted(token)
    .then(response => dispatch(act.RECEIVE_VETTED(response)))
    .catch(error => {
      dispatch(act.RECEIVE_VETTED(null, error));
    });
};

export const onFetchVettedByTokens = tokens => async dispatch => {
  dispatch(act.REQUEST_VETTED(tokens));
  try {
    const promises = tokens.map(t => api.proposal(t));
    const res = await Promise.all(promises);
    const proposals = res.map(r => r.proposal);
    return dispatch(act.RECEIVE_VETTED({ proposals }));
  } catch (error) {
    dispatch(act.RECEIVE_VETTED(null, error));
  }
};

export const onFetchTokenInventory = () => dispatch => {
  dispatch(act.REQUEST_TOKEN_INVENTORY());
  return api
    .tokenInventory()
    .then(tokenInventory =>
      dispatch(act.RECEIVE_TOKEN_INVENTORY(tokenInventory))
    )
    .catch(error => {
      dispatch(act.RECEIVE_TOKEN_INVENTORY(null, error));
    });
};

export const onFetchUnvettedStatus = () => dispatch => {
  dispatch(act.REQUEST_UNVETTED_STATUS());
  return api
    .status()
    .then(response => dispatch(act.RECEIVE_UNVETTED_STATUS(response)))
    .catch(error => {
      dispatch(act.RECEIVE_UNVETTED_STATUS(null, error));
    });
};

export const onFetchUnvetted = token => dispatch => {
  dispatch(act.REQUEST_UNVETTED());
  return api
    .unvetted(token)
    .then(response => dispatch(act.RECEIVE_UNVETTED(response)))
    .catch(error => {
      dispatch(act.RECEIVE_UNVETTED(null, error));
    });
};

export const onFetchProposal = (token, version = null) => dispatch => {
  dispatch(act.REQUEST_PROPOSAL(token));
  return api
    .proposal(token, version)
    .then(response => {
      response && response.proposal && Object.keys(response.proposal).length > 0
        ? dispatch(act.RECEIVE_PROPOSAL(response))
        : dispatch(
            act.RECEIVE_PROPOSAL(
              null,
              new Error("The requested proposal does not exist.")
            )
          );
    })
    .catch(error => {
      dispatch(act.RECEIVE_PROPOSAL(null, error));
    });
};

export const onFetchInvoice = (token, version = null) => dispatch => {
  dispatch(act.REQUEST_INVOICE(token));
  return api
    .invoice(token, version)
    .then(response => {
      response && response.invoice && Object.keys(response.invoice).length > 0
        ? dispatch(act.RECEIVE_INVOICE(response))
        : dispatch(
            act.RECEIVE_PROPOSAL(
              null,
              new Error("The requested invoice does not exist.")
            )
          );
    })
    .catch(error => {
      dispatch(act.RECEIVE_INVOICE(null, error));
    });
};

export const onFetchUser = userId => dispatch => {
  dispatch(act.RESET_EDIT_USER());
  dispatch(act.REQUEST_USER(userId));
  const regexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const valid = regexp.test(userId);
  if (!valid)
    return dispatch(act.RECEIVE_USER(null, "This is not a valid user ID."));
  return api
    .user(userId)
    .then(response => dispatch(act.RECEIVE_USER(response)))
    .catch(error => {
      dispatch(act.RECEIVE_USER(null, error));
    });
};

export const onFetchProposalComments = token =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_PROPOSAL_COMMENTS(token));
    return api
      .proposalComments(token, csrf)
      .then(response => dispatch(act.RECEIVE_PROPOSAL_COMMENTS(response)))
      .catch(error => {
        dispatch(act.RECEIVE_PROPOSAL_COMMENTS(null, error));
      });
  });

export const onFetchLikedComments = token => dispatch => {
  dispatch(act.REQUEST_LIKED_COMMENTS(token));
  return api
    .likedComments(token)
    .then(response => dispatch(act.RECEIVE_LIKED_COMMENTS(response)))
    .catch(error => {
      dispatch(act.RECEIVE_LIKED_COMMENTS(null, error));
    });
};

export const onEditUser = preferences =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_EDIT_USER(preferences));
    return api
      .editUser(csrf, preferences)
      .then(response => dispatch(act.RECEIVE_EDIT_USER(response)))
      .catch(error => {
        dispatch(act.RECEIVE_EDIT_USER(null, error));
      });
  });

export const onManageUser = (userId, action) =>
  withCsrf((dispatch, getState, csrf) => {
    return dispatch(
      confirmWithModal(modalTypes.CONFIRM_ACTION_WITH_REASON, {})
    ).then(({ confirm, reason }) => {
      if (confirm) {
        dispatch(act.REQUEST_MANAGE_USER({ userId, action, reason }));
        return api
          .manageUser(csrf, userId, action, reason)
          .then(response => dispatch(act.RECEIVE_MANAGE_USER(response)))
          .catch(error => {
            dispatch(act.RECEIVE_MANAGE_USER(null, error));
          });
      }
    });
  });

export const onSubmitInvoice = (
  loggedInAsEmail,
  userid,
  username,
  month,
  year,
  exchangerate,
  name,
  location,
  contact,
  rate,
  address,
  lineItems,
  files
) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(
      act.REQUEST_NEW_INVOICE({
        month,
        year,
        exchangerate,
        name,
        location,
        contact,
        rate,
        address,
        lineItems,
        files
      })
    );
    return Promise.resolve(
      api.makeInvoice(
        month,
        year,
        exchangerate,
        name,
        location,
        contact,
        rate,
        address,
        lineItems,
        files
      )
    )
      .then(invoice => api.signRegister(loggedInAsEmail, invoice))
      .then(invoice => api.newInvoice(csrf, invoice))
      .then(invoice => {
        dispatch(
          act.RECEIVE_NEW_INVOICE({
            ...invoice,
            numcomments: 0,
            userid,
            username
          })
        );
        resetNewProposalData();
      })
      .catch(error => {
        dispatch(act.RECEIVE_NEW_INVOICE(null, error));
        resetNewProposalData();
        throw error;
      });
  });

export const onSubmitProposal = (
  loggedInAsEmail,
  userid,
  username,
  name,
  description,
  files
) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_NEW_PROPOSAL({ name, description, files }));
    return Promise.resolve(api.makeProposal(name, description, files))
      .then(proposal => api.signRegister(loggedInAsEmail, proposal))
      .then(proposal => api.newProposal(csrf, proposal))
      .then(proposal => {
        dispatch(
          act.RECEIVE_NEW_PROPOSAL({
            ...proposal,
            numcomments: 0,
            userid,
            username,
            name,
            description
          })
        );
        resetNewProposalData();
      })
      .then(() => {
        dispatch(act.SUBTRACT_PROPOSAL_CREDITS(1));
      })
      .catch(error => {
        dispatch(act.RECEIVE_NEW_PROPOSAL(null, error));
        resetNewProposalData();
        throw error;
      });
  });

export const onSubmitEditedProposal = (
  loggedInAsEmail,
  name,
  description,
  files,
  token
) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_EDIT_PROPOSAL({ name, description, files }));
    return Promise.resolve(api.makeProposal(name, description, files))
      .then(proposal => api.signRegister(loggedInAsEmail, proposal))
      .then(proposal => api.editProposal(csrf, { ...proposal, token }))
      .then(proposal => {
        dispatch(act.RECEIVE_EDIT_PROPOSAL(proposal));
        resetNewProposalData();
      })
      .catch(error => {
        dispatch(act.RECEIVE_EDIT_PROPOSAL(null, error));
        resetNewProposalData();
        throw error;
      });
  });

export const onSubmitEditedInvoice = (
  loggedInAsEmail,
  userid,
  username,
  month,
  year,
  exchangerate,
  name,
  location,
  contact,
  rate,
  address,
  lineItems,
  files,
  token
) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(
      act.REQUEST_EDIT_INVOICE({
        month,
        year,
        exchangerate,
        name,
        location,
        contact,
        rate,
        address,
        lineItems,
        files
      })
    );
    return Promise.resolve(
      api.makeInvoice(
        month,
        year,
        exchangerate,
        name,
        location,
        contact,
        rate,
        address,
        lineItems,
        files
      )
    )
      .then(invoice => api.signRegister(loggedInAsEmail, invoice))
      .then(invoice => api.editInvoice(csrf, { ...invoice, token }))
      .then(invoice => {
        dispatch(
          act.RECEIVE_EDIT_INVOICE({
            ...invoice,
            numcomments: 0,
            userid,
            username
          })
        );
        resetNewProposalData();
      })
      .catch(error => {
        dispatch(act.RECEIVE_EDIT_INVOICE(null, error));
        resetNewProposalData();
        throw error;
      });
  });

export const onLikeComment = (loggedInAsEmail, token, commentid, action) =>
  withCsrf((dispatch, getState, csrf) => {
    if (!loggedInAsEmail) {
      dispatch(openModal("LOGIN", {}, null));
      return;
    }
    dispatch(act.REQUEST_LIKE_COMMENT({ commentid, token }));
    dispatch(act.RECEIVE_SYNC_LIKE_COMMENT({ token, commentid, action }));
    return Promise.resolve(api.makeLikeComment(token, action, commentid))
      .then(comment => api.signLikeComment(loggedInAsEmail, comment))
      .then(comment => api.likeComment(csrf, comment))
      .catch(error => {
        dispatch(act.RESET_SYNC_LIKE_COMMENT());
        dispatch(act.RECEIVE_LIKE_COMMENT(null, error));
      });
  });

export const onCensorComment = (loggedInAsEmail, token, commentid, isCms) =>
  withCsrf((dispatch, getState, csrf) => {
    return dispatch(
      confirmWithModal(modalTypes.CONFIRM_ACTION_WITH_REASON, {})
    ).then(({ confirm, reason }) => {
      if (confirm) {
        dispatch(act.REQUEST_CENSOR_COMMENT({ commentid, token }));
        return Promise.resolve(
          api.makeCensoredComment(token, reason, commentid)
        )
          .then(comment => api.signCensorComment(loggedInAsEmail, comment))
          .then(comment => api.censorComment(csrf, comment))
          .then(response => {
            if (response.receipt) {
              !isCms
                ? dispatch(act.RECEIVE_CENSOR_COMMENT(commentid, null))
                : dispatch(act.RECEIVE_CENSOR_INVOICE_COMMENT(commentid, null));
            }
          })
          .catch(error => {
            dispatch(act.RECEIVE_CENSOR_COMMENT(null, error));
          });
      }
    });
  });

export const onSubmitComment = (
  loggedInAsEmail,
  token,
  comment,
  parentid,
  commentid,
  isCMS = false
) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_NEW_COMMENT({ token, comment, parentid }));
    return Promise.resolve(api.makeComment(token, comment, parentid))
      .then(comment => api.signComment(loggedInAsEmail, comment))
      .then(comment => api.newComment(csrf, comment))
      .then(response => {
        const responsecomment = response.comment;
        !isCMS
          ? dispatch(act.RECEIVE_NEW_COMMENT(responsecomment))
          : dispatch(act.RECEIVE_NEW_INVOICE_COMMENT(responsecomment));
        commentid &&
          dispatch(
            act.RECEIVE_NEW_THREAD_COMMENT({
              id: commentid,
              comment: responsecomment
            })
          );
        return;
      })
      .catch(error => {
        dispatch(act.RECEIVE_NEW_COMMENT(null, error));
        throw error;
      });
  });

export const onUpdateUserKey = loggedInAsEmail =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_UPDATED_KEY());
    return pki
      .generateKeys()
      .then(keys =>
        pki.loadKeys(loggedInAsEmail, keys).then(() =>
          api
            .updateKeyRequest(csrf, pki.toHex(keys.publicKey))
            .then(response => {
              const { verificationtoken } = response;
              if (verificationtoken) {
                const { testnet } = getState().api.init.response;
                if (testnet) {
                  dispatch(act.SHOULD_AUTO_VERIFY_KEY(true));
                }
              }
              return dispatch(
                act.RECEIVE_UPDATED_KEY({ ...response, success: true })
              );
            })
        )
      )
      .catch(error => {
        dispatch(act.RECEIVE_UPDATED_KEY(null, error));
        throw error;
      });
  });

export const onVerifyUserKey = (loggedInAsEmail, verificationtoken) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(
      act.REQUEST_VERIFIED_KEY({ email: loggedInAsEmail, verificationtoken })
    );
    return api
      .verifyKeyRequest(csrf, loggedInAsEmail, verificationtoken)
      .then(response =>
        dispatch(act.RECEIVE_VERIFIED_KEY({ ...response, success: true }))
      )
      .catch(error => {
        dispatch(act.RECEIVE_VERIFIED_KEY(null, error));
      });
  });

export const onSetInvoiceStatus = (
  authorid,
  loggedInAsEmail,
  token,
  status,
  version,
  reason = ""
) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_SETSTATUS_INVOICE({ status, token, reason }));
    return api
      .invoiceSetStatus(loggedInAsEmail, csrf, token, version, status, reason)
      .then(({ invoice }) => {
        dispatch(
          act.RECEIVE_SETSTATUS_INVOICE({
            invoice: {
              ...invoice,
              userid: authorid
            }
          })
        );
        // dispatch(onFetchUnvettedStatus());
      })
      .catch(error => {
        dispatch(act.RECEIVE_SETSTATUS_INVOICE(null, error));
      });
  });

export const onSetProposalStatus = (
  authorid,
  loggedInAsEmail,
  token,
  status,
  censorMessage = ""
) => {
  return withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_SETSTATUS_PROPOSAL({ status, token }));
    if (status === 4) {
      dispatch(act.SET_PROPOSAL_APPROVED(true));
    }
    return api
      .proposalSetStatus(loggedInAsEmail, csrf, token, status, censorMessage)
      .then(({ proposal }) => {
        dispatch(
          act.RECEIVE_SETSTATUS_PROPOSAL({
            proposal: {
              ...proposal,
              userid: authorid
            }
          })
        );
        dispatch(onFetchUnvettedStatus());
      })
      .catch(error => {
        dispatch(act.RECEIVE_SETSTATUS_PROPOSAL(null, error));
      });
  });
};

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

export const onResendVerificationEmail = act.REQUEST_SIGNUP_CONFIRMATION;
export const onResendVerificationEmailConfirm = ({ email }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_RESEND_VERIFICATION_EMAIL({ email }));
    return api
      .resendVerificationEmailRequest(csrf, email)
      .then(response =>
        dispatch(act.RECEIVE_RESEND_VERIFICATION_EMAIL(response))
      )
      .catch(error => {
        dispatch(act.RECEIVE_RESEND_VERIFICATION_EMAIL(null, error));
        throw error;
      });
  });

export const resetResendVerificationEmail = () => dispatch =>
  dispatch(act.RESET_RESEND_VERIFICATION_EMAIL());

export const onPasswordResetRequest = ({
  email,
  verificationtoken,
  newpassword
}) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(
      act.REQUEST_PASSWORD_RESET_REQUEST({
        email,
        verificationtoken,
        newpassword
      })
    );
    return api
      .passwordResetRequest(csrf, email, verificationtoken, newpassword)
      .then(response => dispatch(act.RECEIVE_PASSWORD_RESET_REQUEST(response)))
      .catch(error => {
        dispatch(act.RECEIVE_PASSWORD_RESET_REQUEST(null, error));
        throw error;
      });
  });

export const keyMismatch = payload => dispatch =>
  dispatch(act.KEY_MISMATCH(payload));

export const resetPasswordReset = () => dispatch =>
  dispatch(act.RESET_PASSWORD_RESET_REQUEST());

export const verifyUserPaymentWithPoliteia = txid => {
  return api.verifyUserPayment(txid).then(response => response.haspaid);
};

export const onStartVote = (loggedInAsEmail, token, duration, quorum, pass) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_START_VOTE({ token }));
    return api
      .startVote(loggedInAsEmail, csrf, token, duration, quorum, pass)
      .then(response => {
        dispatch(act.RECEIVE_START_VOTE({ ...response, success: true }));
      })
      .catch(error => {
        dispatch(act.RECEIVE_START_VOTE(null, error));
      });
  });

export const onFetchProposalPaywallDetails = () => dispatch => {
  dispatch(act.REQUEST_PROPOSAL_PAYWALL_DETAILS());
  return api
    .proposalPaywallDetails()
    .then(response => dispatch(act.RECEIVE_PROPOSAL_PAYWALL_DETAILS(response)))
    .catch(error => {
      dispatch(act.RECEIVE_PROPOSAL_PAYWALL_DETAILS(null, error));
    });
};

export const onUpdateProposalCredits = () => dispatch => {
  dispatch(act.REQUEST_UPDATE_PROPOSAL_CREDITS());

  const dispatchAfterWaitFn = callAfterMinimumWait(response => {
    dispatch(act.RECEIVE_UPDATE_PROPOSAL_CREDITS(response));
    dispatch(act.SET_PROPOSAL_CREDITS(response.proposalcredits));
  }, 500);

  return api
    .me()
    .then(dispatchAfterWaitFn)
    .catch(error => {
      dispatch(act.RECEIVE_UPDATE_PROPOSAL_CREDITS(null, error));
    });
};

export const onAddProposalCredits = ({ amount, txNotBefore }) => (
  dispatch,
  getState
) => {
  const propPaywallDetails = getState().api.proposalPaywallDetails;
  let creditPrice = 0.1;
  if (propPaywallDetails) {
    creditPrice = propPaywallDetails.response.creditprice / 100000000;
  } else {
    api.proposalPaywallDetails().then(response => {
      dispatch(act.RECEIVE_PROPOSAL_PAYWALL_DETAILS(response));
      creditPrice = response.creditprice / 100000000;
    });
  }

  return amount
    ? dispatch(
        act.ADD_PROPOSAL_CREDITS({
          amount: Math.round((amount * 1) / creditPrice),
          txid: txNotBefore
        })
      )
    : null;
};

export const onUserProposalCredits = () => dispatch => {
  dispatch(act.REQUEST_USER_PROPOSAL_CREDITS());

  const dispatchAfterWaitFn = callAfterMinimumWait(response => {
    dispatch(act.RECEIVE_USER_PROPOSAL_CREDITS(response));
    dispatch(
      act.SET_PROPOSAL_CREDITS(
        response.unspentcredits ? response.unspentcredits.length : 0
      )
    );
  }, 500);

  return api
    .userProposalCredits()
    .then(dispatchAfterWaitFn)
    .catch(error => {
      dispatch(act.RECEIVE_USER_PROPOSAL_CREDITS(null, error));
    });
};

export const onFetchProposalsVoteStatus = () => dispatch => {
  dispatch(act.REQUEST_PROPOSALS_VOTE_STATUS());
  return api
    .proposalsVoteStatus()
    .then(response =>
      dispatch(
        act.RECEIVE_PROPOSALS_VOTE_STATUS({ ...response, success: true })
      )
    )
    .catch(error => {
      dispatch(act.RECEIVE_PROPOSALS_VOTE_STATUS(null, error));
      throw error;
    });
};

export const onFetchProposalVoteStatus = token => dispatch => {
  dispatch(act.REQUEST_PROPOSAL_VOTE_STATUS({ token }));
  return api
    .proposalVoteStatus(token)
    .then(response =>
      dispatch(act.RECEIVE_PROPOSAL_VOTE_STATUS({ ...response, success: true }))
    )
    .catch(error => {
      dispatch(act.RECEIVE_PROPOSAL_VOTE_STATUS(null, error));
      throw error;
    });
};

export const onFetchProposalVoteResults = token => dispatch => {
  dispatch(act.REQUEST_PROPOSAL_VOTE_RESULTS({ token }));
  return api
    .proposalVoteResults(token)
    .then(response =>
      dispatch(
        act.RECEIVE_PROPOSAL_VOTE_RESULTS({ ...response, success: true })
      )
    )
    .catch(error => {
      dispatch(act.RECEIVE_PROPOSAL_VOTE_RESULTS(null, error));
      throw error;
    });
};

export const onAuthorizeVote = (email, token, version) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_AUTHORIZE_VOTE({ token }));
    return api
      .proposalAuthorizeOrRevokeVote(csrf, "authorize", token, email, version)
      .then(response =>
        dispatch(act.RECEIVE_AUTHORIZE_VOTE({ ...response, success: true }))
      )
      .catch(error => {
        dispatch(act.RECEIVE_AUTHORIZE_VOTE(null, error));
        throw error;
      });
  });

export const onRevokeVote = (email, token, version) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_AUTHORIZE_VOTE({ token }));
    return api
      .proposalAuthorizeOrRevokeVote(csrf, "revoke", token, email, version)
      .then(response =>
        dispatch(act.RECEIVE_REVOKE_AUTH_VOTE({ ...response, success: true }))
      )
      .catch(error => {
        dispatch(act.RECEIVE_REVOKE_AUTH_VOTE(null, error));
        throw error;
      });
  });

export const onFetchProposalPaywallPayment = () => dispatch => {
  dispatch(act.REQUEST_PROPOSAL_PAYWALL_PAYMENT());
  return api
    .proposalPaywallPayment()
    .then(response => dispatch(act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT(response)))
    .catch(error => {
      dispatch(act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT(null, error));
      throw error;
    });
};

export const onRescanUserPayments = userid =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_RESCAN_USER_PAYMENTS(userid));
    return api
      .rescanUserPayments(csrf, userid)
      .then(response => {
        dispatch(act.RECEIVE_RESCAN_USER_PAYMENTS(response));

        // if the rescan returns new credits, a refetch of the user details
        // is needed to update the user credits.
        // if(response.newcredits && response.newcredits.length > 0) {
        //   dispatch(onFetchUser(userid));
        // }
      })
      .catch(error => {
        dispatch(act.RECEIVE_RESCAN_USER_PAYMENTS(null, error));
        throw error;
      });
  });

export const onGeneratePayouts = () =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_GENERATE_PAYOUTS({}));
    return api
      .generatePayouts(csrf)
      .then(response => {
        dispatch(act.RECEIVE_GENERATE_PAYOUTS(response));
      })
      .catch(error => {
        dispatch(act.RECEIVE_GENERATE_PAYOUTS(null, error));
      });
  });

export const onFetchExchangeRate = (month, year) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_EXCHANGE_RATE({ month, year }));
    return api
      .exchangeRate(csrf, +month, +year)
      .then(response => {
        dispatch(act.RECEIVE_EXCHANGE_RATE(response));
      })
      .catch(error => {
        dispatch(act.RECEIVE_EXCHANGE_RATE(null, error));
      });
  });
