import Promise from "promise";
import * as modalTypes from "../components/Modal/modalTypes";
import { PROPOSAL_STATUS_PUBLIC } from "../constants";
import * as api from "../lib/api";
import {
  resetNewInvoiceData,
  resetNewProposalData
} from "../lib/editors_content_backup";
import { clearStateLocalStorage } from "../lib/local_storage";
import * as pki from "../lib/pki";
import * as sel from "../selectors";
import act from "./methods";
import { closeModal, confirmWithModal, openModal } from "./modal";
import { PAYWALL_STATUS_PAID } from "../constants";

export const onResetProposal = act.RESET_PROPOSAL;
export const onResetInvoice = act.RESET_INVOICE;

export const onSetEmail = act.SET_EMAIL;

export const onSignup = act.REQUEST_SIGNUP_CONFIRMATION;
export const onResetSignup = act.RESET_SIGNUP_CONFIRMATION;
export const onResetRescanUserPayments = act.RESET_RESCAN_USER_PAYMENTS;
export const onSignupConfirm = (props, isCMS) => (dispatch) => {
  if (isCMS) {
    dispatch(onCreateNewUserCMS(props));
  } else {
    dispatch(onCreateNewUser(props));
  }
};

export const requestApiInfo = (fetchUser = true) => (dispatch) => {
  dispatch(act.REQUEST_INIT_SESSION());
  return api
    .apiInfo()
    .then((response) => {
      dispatch(act.RECEIVE_INIT_SESSION(response));

      // if there is an active session, try to fetch the user information
      // otherwise we make sure there are no user data saved into localstorage
      if (!response.activeusersession) {
        clearStateLocalStorage();
      } else if (fetchUser) {
        dispatch(onRequestMe());
      }

      return response;
    })
    .catch((error) => {
      dispatch(act.RECEIVE_INIT_SESSION(null, error));
      throw error;
    });
};

export const onRequestMe = () => (dispatch) => {
  dispatch(act.REQUEST_ME());
  return api
    .me()
    .then((response) => {
      dispatch(act.RECEIVE_ME(response));
    })
    .catch((error) => {
      dispatch(act.RECEIVE_ME(null, error));
      clearStateLocalStorage();
      throw error;
    });
};

export const updateMe = (payload) => (dispatch) =>
  dispatch(act.UPDATE_ME(payload));

export const cleanErrors = act.CLEAN_ERRORS;

let globalpollingpointer = null;

export const clearPollingPointer = () => clearTimeout(globalpollingpointer);
export const setPollingPointer = (paymentpolling) => {
  globalpollingpointer = paymentpolling;
};

const POLL_INTERVAL = 10 * 1000;
export const onPollUserPayment = () => (dispatch) => {
  return api
    .verifyUserPayment()
    .then((response) => response.haspaid)
    .then((verified) => {
      if (verified) {
        dispatch(
          act.UPDATE_USER_PAYWALL_STATUS({ status: PAYWALL_STATUS_PAID })
        );
      } else {
        const paymentpolling = setTimeout(
          () => dispatch(onPollUserPayment()),
          POLL_INTERVAL
        );
        setPollingPointer(paymentpolling);
      }
    })
    .catch((error) => {
      clearPollingPointer();
      throw error;
    });
};

export const onGetPolicy = () => (dispatch) => {
  dispatch(act.REQUEST_POLICY());
  return api
    .policy()
    .then((response) => dispatch(act.RECEIVE_POLICY(response)))
    .catch((error) => {
      dispatch(act.RECEIVE_POLICY(null, error));
      throw error;
    });
};

export const withCsrf = (fn) => (dispatch, getState) => {
  const csrf = sel.csrf(getState());
  const csrfIsNeeded = sel.getCsrfIsNeeded(getState());
  if (csrf || csrfIsNeeded) return fn(dispatch, getState, csrf);

  dispatch(act.CSRF_NEEDED(true));
  return dispatch(requestApiInfo()).then(() =>
    withCsrf(fn)(dispatch, getState)
  );
};

export const onInviteUserConfirm = (email) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_INVITE_USER({ email }));
    return api
      .inviteNewUser(csrf, email)
      .then((response) => {
        dispatch(act.RECEIVE_INVITE_USER(response));
        dispatch(closeModal());
      })
      .catch((error) => {
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
      .then((response) => {
        dispatch(act.RECEIVE_NEW_USER(response));
        dispatch(closeModal());
      })
      .catch((error) => {
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
      .then((response) => {
        dispatch(act.RECEIVE_NEW_USER(response));
        dispatch(closeModal());
      })
      .catch((error) => {
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

export const onVerifyNewUser = (email, verificationToken) => (dispatch) => {
  dispatch(act.REQUEST_VERIFY_NEW_USER({ email, verificationToken }));
  return api
    .verifyNewUser(email, verificationToken)
    .then((res) => dispatch(act.RECEIVE_VERIFY_NEW_USER(res)))
    .catch((err) => {
      dispatch(act.RECEIVE_VERIFY_NEW_USER(null, err));
      throw err;
    });
};

export const onSearchUser = (query) => (dispatch) => {
  dispatch(act.REQUEST_USER_SEARCH());
  return api
    .searchUser(query)
    .then((res) => dispatch(act.RECEIVE_USER_SEARCH({ ...res, query })))
    .catch((err) => {
      dispatch(act.RECEIVE_USER_SEARCH(null, err));
      throw err;
    });
};

export const onLogin = ({ email, password }) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_LOGIN({ email }));
    return api
      .login(csrf, email, password)
      .then((response) => {
        dispatch(act.RECEIVE_LOGIN(response));
        return response;
      })
      .then(() => dispatch(onRequestMe()))
      .catch((error) => {
        dispatch(act.RECEIVE_LOGIN(null, error));
        throw error;
      });
  });

// handleLogout handles all the procedure to be done once the user is logged out
// it can be called either when the logout request has been successful or when the
// session has already expired
export const handleLogout = (response) => (dispatch) => {
  dispatch(act.RECEIVE_LOGOUT(response));
  clearStateLocalStorage();
  clearPollingPointer();
  clearProposalPaymentPollingPointer();
  dispatch(onSetEmail(""));
  dispatch(act.RESET_USER_SEARCH());
};

export const onLogout = () =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_LOGOUT());
    return api
      .logout(csrf)
      .then((response) => {
        dispatch(handleLogout(response));
      })
      .catch((error) => {
        dispatch(act.RECEIVE_LOGOUT(null, error));
      });
  });

export const onChangeUsername = (password, newUsername) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_CHANGE_USERNAME());
    return api
      .changeUsername(csrf, password, newUsername)
      .then((response) =>
        dispatch(
          act.RECEIVE_CHANGE_USERNAME({ ...response, username: newUsername })
        )
      )
      .catch((error) => {
        dispatch(act.RECEIVE_CHANGE_USERNAME(null, error));
        throw error;
      });
  });

export const onChangePassword = (password, newPassword) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_CHANGE_PASSWORD());
    return api
      .changePassword(csrf, password, newPassword)
      .then((response) => dispatch(act.RECEIVE_CHANGE_PASSWORD(response)))
      .catch((error) => {
        dispatch(act.RECEIVE_CHANGE_PASSWORD(null, error));
        throw error;
      });
  });

export const onFetchUserProposals = (userid, token) => (dispatch) => {
  dispatch(act.REQUEST_USER_PROPOSALS());
  return api
    .userProposals(userid, token)
    .then((response) =>
      dispatch(act.RECEIVE_USER_PROPOSALS({ ...response, userid }))
    )
    .catch((error) => {
      dispatch(act.RECEIVE_USER_PROPOSALS(null, error));
    });
};

export const onFetchUserInvoices = (userid, token) => (dispatch) => {
  dispatch(act.REQUEST_USER_INVOICES());
  return api
    .userInvoices(userid, token)
    .then((response) => dispatch(act.RECEIVE_USER_INVOICES(response)))
    .catch((error) => {
      dispatch(act.RECEIVE_USER_INVOICES(null, error));
      throw error;
    });
};
export const onFetchAdminUserInvoices = (userid) => (dispatch) => {
  dispatch(act.REQUEST_ADMIN_USER_INVOICES());
  return api
    .adminUserInvoices(userid)
    .then((response) => dispatch(act.RECEIVE_ADMIN_USER_INVOICES(response)))
    .catch((error) => {
      dispatch(act.RECEIVE_ADMIN_USER_INVOICES(null, error));
    });
};

export const onFetchInvoiceComments = (token) => (dispatch) => {
  dispatch(act.REQUEST_RECORD_COMMENTS());
  return api
    .invoiceComments(token)
    .then((response) => {
      dispatch(act.RECEIVE_RECORD_COMMENTS({ ...response, token }));
    })
    .catch((error) => {
      dispatch(act.RECEIVE__RECORD_COMMENTS(null, error));
      throw error;
    });
};

export const onFetchAdminInvoices = () =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_ADMIN_INVOICES());
    return api
      .adminInvoices(csrf)
      .then((response) => dispatch(act.RECEIVE_ADMIN_INVOICES(response)))
      .catch((error) => {
        dispatch(act.RECEIVE_ADMIN_INVOICES(null, error));
      });
  });

export const onFetchVetted = (token) => (dispatch) => {
  dispatch(act.REQUEST_VETTED());
  return api
    .vetted(token)
    .then((response) => dispatch(act.RECEIVE_VETTED(response)))
    .catch((error) => {
      dispatch(act.RECEIVE_VETTED(null, error));
    });
};

export const onFetchProposalsBatch = (tokens, fetchVoteStatus = true) =>
  withCsrf(async (dispatch, _, csrf) => {
    dispatch(act.REQUEST_PROPOSALS_BATCH(tokens));
    try {
      const promises = [api.proposalsBatch(csrf, tokens)];
      if (fetchVoteStatus) {
        promises.push(dispatch(onFetchProposalsBatchVoteSummary(tokens)));
      }
      const response = await Promise.all(promises);
      const proposals = response.find((res) => res && res.proposals).proposals;
      dispatch(act.RECEIVE_PROPOSALS_BATCH({ proposals }));
    } catch (e) {
      dispatch(act.RECEIVE_PROPOSALS_BATCH(null, e));
    }
  });

export const onFetchVettedByTokens = (tokens, fetchVoteStatus = true) => async (
  dispatch
) => {
  dispatch(act.REQUEST_VETTED(tokens));
  try {
    let promises = tokens.map((t) => api.proposal(t));

    if (fetchVoteStatus) {
      const voteStatusPromises = tokens.map((t) =>
        dispatch(onFetchProposalVoteStatus(t))
      );
      promises = promises.concat(voteStatusPromises);
    }
    const res = await Promise.all(promises);

    // filter only proposals responses
    const proposals = res.filter((r) => r && r.proposal).map((r) => r.proposal);

    return dispatch(act.RECEIVE_VETTED({ proposals }));
  } catch (error) {
    dispatch(act.RECEIVE_VETTED(null, error));
  }
};

export const onFetchTokenInventory = () => (dispatch) => {
  dispatch(act.REQUEST_TOKEN_INVENTORY());
  return api
    .tokenInventory()
    .then((tokenInventory) =>
      dispatch(act.RECEIVE_TOKEN_INVENTORY(tokenInventory))
    )
    .catch((error) => {
      dispatch(act.RECEIVE_TOKEN_INVENTORY(null, error));
      throw error;
    });
};

export const onFetchUnvettedStatus = () => (dispatch) => {
  dispatch(act.REQUEST_UNVETTED_STATUS());
  return api
    .status()
    .then((response) => dispatch(act.RECEIVE_UNVETTED_STATUS(response)))
    .catch((error) => {
      dispatch(act.RECEIVE_UNVETTED_STATUS(null, error));
    });
};

export const onFetchUnvetted = (token) => (dispatch) => {
  dispatch(act.REQUEST_UNVETTED());
  return api
    .unvetted(token)
    .then((response) => dispatch(act.RECEIVE_UNVETTED(response)))
    .catch((error) => {
      dispatch(act.RECEIVE_UNVETTED(null, error));
    });
};

export const onFetchProposal = (token, version = null) => (dispatch) => {
  dispatch(act.REQUEST_PROPOSAL(token));
  return api
    .proposal(token, version)
    .then((response) => {
      response && response.proposal && Object.keys(response.proposal).length > 0
        ? dispatch(act.RECEIVE_PROPOSAL(response))
        : dispatch(
            act.RECEIVE_PROPOSAL(
              null,
              new Error("The requested proposal does not exist.")
            )
          );
    })
    .catch((error) => {
      dispatch(act.RECEIVE_PROPOSAL(null, error));
    });
};

export const onFetchInvoice = (token, version = null) => (dispatch) => {
  dispatch(act.REQUEST_INVOICE(token));
  return api
    .invoice(token, version)
    .then((response) => {
      response && response.invoice && Object.keys(response.invoice).length > 0
        ? dispatch(act.RECEIVE_INVOICE(response))
        : dispatch(
            act.RECEIVE_PROPOSAL(
              null,
              new Error("The requested invoice does not exist.")
            )
          );
    })
    .catch((error) => {
      dispatch(act.RECEIVE_INVOICE(null, error));
      throw error;
    });
};

export const onFetchUser = (userId) => (dispatch) => {
  dispatch(act.RESET_EDIT_USER());
  dispatch(act.REQUEST_USER(userId));
  const regexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const valid = regexp.test(userId);
  if (!valid) {
    const error = new Error("This is not a valid user ID.");
    dispatch(act.RECEIVE_USER(null, error));
    throw error;
  }

  return api
    .user(userId)
    .then((response) =>
      dispatch(
        act.RECEIVE_USER({
          user: {
            ...response.user,
            userid: userId
          }
        })
      )
    )
    .catch((error) => {
      dispatch(act.RECEIVE_USER(null, error));
      throw error;
    });
};

export const onFetchProposalComments = (token) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_RECORD_COMMENTS(token));
    return api
      .proposalComments(token, csrf)
      .then((response) =>
        dispatch(act.RECEIVE_RECORD_COMMENTS({ ...response, token }))
      )
      .catch((error) => {
        dispatch(act.RECEIVE_RECORD_COMMENTS(null, error));
      });
  });

export const onFetchLikedComments = (token) => (dispatch) => {
  dispatch(act.REQUEST_LIKED_COMMENTS(token));
  return api
    .likedComments(token)
    .then((response) =>
      dispatch(act.RECEIVE_LIKED_COMMENTS({ ...response, token }))
    )
    .catch((error) => {
      dispatch(act.RECEIVE_LIKED_COMMENTS(null, error));
    });
};

export const onEditUser = (preferences) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_EDIT_USER(preferences));
    return api
      .editUser(csrf, preferences)
      .then((response) => {
        dispatch(act.RECEIVE_EDIT_USER({ ...response, preferences }));
      })
      .catch((error) => {
        dispatch(act.RECEIVE_EDIT_USER(null, error));
      });
  });

export const onManageCmsUser = (args) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_MANAGE_CMS_USER());
    const { userid, ...newContractorProps } = args;
    return api
      .manageCmsUser(csrf, userid, newContractorProps)
      .then((response) =>
        dispatch(
          act.RECEIVE_MANAGE_CMS_USER({ ...response, ...newContractorProps })
        )
      )
      .catch((error) => {
        dispatch(act.RECEIVE_MANAGE_CMS_USER(null, error));
      });
  });

export const onManageCmsUserV2 = (userID, domain, type, supervisorIDs) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_MANAGE_CMS_USER());
    return api
      .manageCmsUser(csrf, userID, domain, type, supervisorIDs)
      .then((response) =>
        dispatch(
          act.RECEIVE_MANAGE_CMS_USER({
            ...response,
            userID,
            domain,
            type,
            supervisorIDs
          })
        )
      )
      .catch((error) => {
        dispatch(act.RECEIVE_MANAGE_CMS_USER(null, error));
        throw error;
      });
  });

// TODO: erase this after the refactor and make the onManageUserv2 official
export const onManageUser = (userId, action) =>
  withCsrf((dispatch, getState, csrf) => {
    return dispatch(
      confirmWithModal(modalTypes.CONFIRM_ACTION_WITH_REASON, {})
    ).then(({ confirm, reason }) => {
      if (confirm) {
        dispatch(act.REQUEST_MANAGE_USER({ userId, action, reason }));
        return api
          .manageUser(csrf, userId, action, reason)
          .then((response) => dispatch(act.RECEIVE_MANAGE_USER(response)))
          .catch((error) => {
            dispatch(act.RECEIVE_MANAGE_USER(null, error));
          });
      }
    });
  });

export const onManageUserv2 = (userId, action, reason) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_MANAGE_USER({ userId, action, reason }));
    return api
      .manageUser(csrf, userId, action, reason)
      .then((response) => {
        dispatch(act.RECEIVE_MANAGE_USER(response));
        // Fetches new user information to update cache
        dispatch(onFetchUser(userId));
      })
      .catch((error) => {
        dispatch(act.RECEIVE_MANAGE_USER(null, error));
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
      .then((invoice) => api.signRegister(loggedInAsEmail, invoice))
      .then((invoice) => api.newInvoice(csrf, invoice))
      .then((invoice) => {
        dispatch(
          act.RECEIVE_NEW_INVOICE({
            ...invoice,
            numcomments: 0,
            userid,
            username
          })
        );
        resetNewInvoiceData();
      })
      .catch((error) => {
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
      .then((proposal) => api.signRegister(loggedInAsEmail, proposal))
      .then((proposal) => api.newProposal(csrf, proposal))
      .then((proposal) => {
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
      .catch((error) => {
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
      .then((proposal) => api.signRegister(loggedInAsEmail, proposal))
      .then((proposal) => api.editProposal(csrf, { ...proposal, token }))
      .then((proposal) => {
        dispatch(act.RECEIVE_EDIT_PROPOSAL(proposal));
        resetNewProposalData();
      })
      .catch((error) => {
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
      .then((invoice) => api.signRegister(loggedInAsEmail, invoice))
      .then((invoice) => api.editInvoice(csrf, { ...invoice, token }))
      .then((invoice) => {
        dispatch(
          act.RECEIVE_EDIT_INVOICE({
            ...invoice,
            numcomments: 0,
            userid,
            username
          })
        );
        resetNewInvoiceData();
      })
      .catch((error) => {
        dispatch(act.RECEIVE_EDIT_INVOICE(null, error));
        resetNewInvoiceData();
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
      .then((comment) => api.signLikeComment(loggedInAsEmail, comment))
      .then((comment) => api.likeComment(csrf, comment))
      .then(() => dispatch(act.RECEIVE_LIKE_COMMENT({ token })))
      .catch((error) => {
        dispatch(act.RESET_SYNC_LIKE_COMMENT({ token }));
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
          .then((comment) => api.signCensorComment(loggedInAsEmail, comment))
          .then((comment) => api.censorComment(csrf, comment))
          .then((response) => {
            if (response.receipt) {
              !isCms
                ? dispatch(
                    act.RECEIVE_CENSOR_COMMENT({ commentid, token }, null)
                  )
                : dispatch(act.RECEIVE_CENSOR_INVOICE_COMMENT(commentid, null));
            }
          })
          .catch((error) => {
            dispatch(act.RECEIVE_CENSOR_COMMENT(null, error));
          });
      }
    });
  });

export const onCensorCommentv2 = (email, token, commentid, reason) => {
  return withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_CENSOR_COMMENT({ commentid, token }));
    return Promise.resolve(api.makeCensoredComment(token, reason, commentid))
      .then((comment) => api.signCensorComment(email, comment))
      .then((comment) => api.censorComment(csrf, comment))
      .then((response) => {
        if (response.receipt) {
          dispatch(act.RECEIVE_CENSOR_COMMENT({ commentid, token }, null));
        }
      })
      .catch((error) => {
        dispatch(act.RECEIVE_CENSOR_COMMENT(null, error));
        throw error;
      });
  });
};

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
      .then((comment) => api.signComment(loggedInAsEmail, comment))
      .then((comment) => {
        // make sure this is not a duplicate comment by comparing to the existent
        // comments signatures
        const comments = sel.commentsByToken(getState())[token];
        const signatureFound =
          comments && comments.find((cm) => cm.signature === comment.signature);
        if (signatureFound) {
          throw new Error("That is a duplicate comment.");
        }
        return comment;
      })
      .then((comment) => api.newComment(csrf, comment))
      .then((response) => {
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
      .catch((error) => {
        dispatch(act.RECEIVE_NEW_COMMENT(null, error));
        throw error;
      });
  });

export const onUpdateUserKey = (currentUserEmail) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_UPDATED_KEY());
    return pki
      .generateKeys()
      .then((keys) =>
        pki.loadKeys(currentUserEmail, keys).then(() =>
          api
            .updateKeyRequest(csrf, pki.toHex(keys.publicKey))
            .then((response) => {
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
      .catch((error) => {
        dispatch(act.RECEIVE_UPDATED_KEY(null, error));
        throw error;
      });
  });

export const onVerifyUserKey = (currentUserEmail, verificationtoken) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(
      act.REQUEST_VERIFIED_KEY({ email: currentUserEmail, verificationtoken })
    );
    return api
      .verifyKeyRequest(csrf, currentUserEmail, verificationtoken)
      .then((response) =>
        pki.myPubKeyHex(currentUserEmail).then((pubkey) => {
          dispatch(
            act.RECEIVE_VERIFIED_KEY({
              ...response,
              success: true,
              publickey: pubkey
            })
          );
          dispatch(act.SHOULD_AUTO_VERIFY_KEY(false));
        })
      )
      .catch((error) => {
        dispatch(act.RECEIVE_VERIFIED_KEY(null, error));
      });
  });

export const onSetInvoiceStatus = (token, status, version, reason = "") =>
  withCsrf((dispatch, getState, csrf) => {
    const email = sel.currentUserEmail(getState());
    dispatch(
      act.REQUEST_SETSTATUS_INVOICE({ status, token, reason, version, email })
    );
    return api
      .invoiceSetStatus(email, csrf, token, version, status, reason)
      .then(({ invoice }) => {
        dispatch(act.RECEIVE_SETSTATUS_INVOICE(invoice));
      })
      .catch((error) => {
        dispatch(act.RECEIVE_SETSTATUS_INVOICE(null, error));
        throw error;
      });
  });

export const onSetProposalStatusV2 = (token, status, censorMessage = "") =>
  withCsrf((dispatch, getState, csrf) => {
    const email = sel.currentUserEmail(getState());
    dispatch(act.REQUEST_SETSTATUS_PROPOSAL({ status, token }));
    return api
      .proposalSetStatus(email, csrf, token, status, censorMessage)
      .then(({ proposal }) => {
        dispatch(
          act.RECEIVE_SETSTATUS_PROPOSAL({
            proposal
          })
        );
        if (status === PROPOSAL_STATUS_PUBLIC) {
          dispatch(onFetchProposalsBatchVoteSummary([token]));
        }
      })
      .catch((error) => {
        dispatch(act.RECEIVE_SETSTATUS_PROPOSAL(null, error));
        throw error;
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
    if (status === PROPOSAL_STATUS_PUBLIC) {
      dispatch(act.SET_PROPOSAL_APPROVED(true));
    }
    return api
      .proposalSetStatus(loggedInAsEmail, csrf, token, status, censorMessage)
      .then(({ proposal }) => {
        dispatch(
          act.RECEIVE_SETSTATUS_PROPOSAL({
            proposal
          })
        );
        if (status === PROPOSAL_STATUS_PUBLIC) {
          dispatch(onFetchProposalVoteStatus(token));
        }
        dispatch(onFetchUnvettedStatus());
      })
      .catch((error) => {
        dispatch(act.RECEIVE_SETSTATUS_PROPOSAL(null, error));
        throw error;
      });
  });
};

export const redirectedFrom = (location) => (dispatch) =>
  dispatch(act.REDIRECTED_FROM(location));
export const resetRedirectedFrom = () => (dispatch) =>
  dispatch(act.RESET_REDIRECTED_FROM());

export const onForgottenPasswordRequest = ({ email }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_FORGOTTEN_PASSWORD_REQUEST({ email }));
    return api
      .forgottenPasswordRequest(csrf, email)
      .then((response) =>
        dispatch(act.RECEIVE_FORGOTTEN_PASSWORD_REQUEST(response))
      )
      .catch((error) => {
        dispatch(act.RECEIVE_FORGOTTEN_PASSWORD_REQUEST(null, error));
        throw error;
      });
  });

export const resetForgottenPassword = () => (dispatch) =>
  dispatch(act.RESET_FORGOTTEN_PASSWORD_REQUEST());

// XXXX: Do not use this action for production code before the following
// PR is meged: https://github.com/decred/politeia/pull/937
export const onResetPassword = ({ username, email }) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_RESET_PASSWORD({ username, email }));
    return api
      .resetPassword(csrf, username, email)
      .then((response) => dispatch(act.RECEIVE_RESET_PASSWORD(response)))
      .catch((error) => {
        dispatch(act.RECEIVE_RESET_PASSWORD(null, error));
        throw error;
      });
  });

// XXXX: Do not use this action for production code before the following
// PR is meged: https://github.com/decred/politeia/pull/937
export const onVerifyResetPassword = ({
  username,
  verificationtoken,
  newpassword
}) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_RESET_PASSWORD({ username }));
    return api
      .verifyResetPassword(csrf, username, verificationtoken, newpassword)
      .then((response) => dispatch(act.RECEIVE_VERIFY_RESET_PASSWORD(response)))
      .catch((error) => {
        dispatch(act.RECEIVE_VERIFY_RESET_PASSWORD(null, error));
        throw error;
      });
  });

export const onResendVerificationEmail = act.REQUEST_SIGNUP_CONFIRMATION;
export const onResendVerificationEmailConfirm = ({ email }) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_RESEND_VERIFICATION_EMAIL({ email }));
    return api
      .resendVerificationEmailRequest(csrf, email)
      .then((response) =>
        dispatch(act.RECEIVE_RESEND_VERIFICATION_EMAIL(response))
      )
      .catch((error) => {
        dispatch(act.RECEIVE_RESEND_VERIFICATION_EMAIL(null, error));
        throw error;
      });
  });

export const resetResendVerificationEmail = () => (dispatch) =>
  dispatch(act.RESET_RESEND_VERIFICATION_EMAIL());

// USING THIS ON PASSWORD RESET
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
      .then((response) =>
        dispatch(act.RECEIVE_PASSWORD_RESET_REQUEST(response))
      )
      .catch((error) => {
        dispatch(act.RECEIVE_PASSWORD_RESET_REQUEST(null, error));
        throw error;
      });
  });

export const keyMismatch = (payload) => (dispatch) =>
  dispatch(act.KEY_MISMATCH(payload));

export const resetPasswordReset = () => (dispatch) =>
  dispatch(act.RESET_RESET_PASSWORD());

export const onStartVote = (loggedInAsEmail, token, duration, quorum, pass) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_START_VOTE({ token }));
    return api
      .startVote(loggedInAsEmail, csrf, token, duration, quorum, pass)
      .then((response) => {
        dispatch(onFetchProposalsBatchVoteSummary([token]));
        dispatch(act.RECEIVE_START_VOTE({ ...response, token, success: true }));
      })
      .catch((error) => {
        dispatch(act.RECEIVE_START_VOTE(null, error));
        throw error;
      });
  });

export const onFetchProposalPaywallDetails = () => (dispatch) => {
  dispatch(act.REQUEST_PROPOSAL_PAYWALL_DETAILS());
  return api
    .proposalPaywallDetails()
    .then((response) =>
      dispatch(act.RECEIVE_PROPOSAL_PAYWALL_DETAILS(response))
    )
    .catch((error) => {
      dispatch(act.RECEIVE_PROPOSAL_PAYWALL_DETAILS(null, error));
    });
};

export const onUserProposalCredits = () => (dispatch, getState) => {
  dispatch(act.REQUEST_USER_PROPOSAL_CREDITS());
  const userid = sel.currentUserID(getState());
  return api
    .userProposalCredits()
    .then((response) =>
      dispatch(act.RECEIVE_USER_PROPOSAL_CREDITS({ ...response, userid }))
    )
    .catch((error) => {
      dispatch(act.RECEIVE_USER_PROPOSAL_CREDITS(null, error));
    });
};

export const onFetchProposalsVoteStatus = () => (dispatch) => {
  dispatch(act.REQUEST_PROPOSALS_VOTE_STATUS());
  return api
    .proposalsVoteStatus()
    .then((response) =>
      dispatch(
        act.RECEIVE_PROPOSALS_VOTE_STATUS({ ...response, success: true })
      )
    )
    .catch((error) => {
      dispatch(act.RECEIVE_PROPOSALS_VOTE_STATUS(null, error));
      throw error;
    });
};

export const onFetchUserProposalsWithVoteStatus = (userid, token) => async (
  dispatch
) => {
  dispatch(act.REQUEST_USER_PROPOSALS({ userid }));
  try {
    const { proposals, ...response } = await api.userProposals(userid, token);
    const publicPropsTokens = proposals
      .filter((prop) => prop.status === PROPOSAL_STATUS_PUBLIC)
      .map((prop) => prop.censorshiprecord.token);

    if (publicPropsTokens.length) {
      await dispatch(onFetchProposalsVoteStatusByTokens(publicPropsTokens));
    }
    dispatch(act.RECEIVE_USER_PROPOSALS({ proposals, userid, ...response }));
  } catch (e) {
    dispatch(act.RECEIVE_USER_PROPOSALS(null, e));
  }
};

export const onFetchUserProposalsWithVoteSummary = (userid, token) => async (
  dispatch
) => {
  dispatch(act.REQUEST_USER_PROPOSALS({ userid }));
  try {
    const { proposals, ...response } = await api.userProposals(userid, token);
    const publicPropsTokens = proposals
      .filter((prop) => prop.status === PROPOSAL_STATUS_PUBLIC)
      .map((prop) => prop.censorshiprecord.token);

    if (publicPropsTokens.length) {
      await dispatch(onFetchProposalsBatchVoteSummary(publicPropsTokens));
    }
    dispatch(act.RECEIVE_USER_PROPOSALS({ proposals, userid, ...response }));
  } catch (e) {
    dispatch(act.RECEIVE_USER_PROPOSALS(null, e));
    throw e;
  }
};

export const onFetchProposalsVoteStatusByTokens = (tokens) => async (
  dispatch
) => {
  dispatch(act.REQUEST_PROPOSALS_VOTE_STATUS({ tokens }));
  try {
    const promises = tokens.map((token) => api.proposalVoteStatus(token));
    const res = await Promise.all(promises);
    dispatch(
      act.RECEIVE_PROPOSALS_VOTE_STATUS({ votesstatus: res, success: true })
    );
  } catch (e) {
    dispatch(act.RECEIVE_PROPOSALS_VOTE_STATUS(null, e));
    throw e;
  }
};

export const onFetchProposalsBatchVoteSummary = (tokens) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_PROPOSALS_VOTE_SUMMARY({ tokens }));
    return api
      .proposalsBatchVoteSummary(csrf, tokens)
      .then((response) => {
        dispatch(
          act.RECEIVE_PROPOSALS_VOTE_SUMMARY({ ...response, success: true })
        );
        return response;
      })
      .catch((error) => {
        dispatch(act.RECEIVE_PROPOSALS_VOTE_SUMMARY(null, error));
        throw error;
      });
  });

export const onFetchProposalVoteStatus = (token) => (dispatch) => {
  dispatch(act.REQUEST_PROPOSAL_VOTE_STATUS({ token }));
  return api
    .proposalVoteStatus(token)
    .then((response) => {
      dispatch(
        act.RECEIVE_PROPOSAL_VOTE_STATUS({ ...response, success: true })
      );
      return response;
    })
    .catch((error) => {
      dispatch(act.RECEIVE_PROPOSAL_VOTE_STATUS(null, error));
    });
};

export const onFetchProposalVoteResults = (token) => (dispatch) => {
  dispatch(act.REQUEST_PROPOSAL_VOTE_RESULTS({ token }));
  return api
    .proposalVoteResults(token)
    .then((response) =>
      dispatch(
        act.RECEIVE_PROPOSAL_VOTE_RESULTS({ ...response, success: true })
      )
    )
    .catch((error) => {
      dispatch(act.RECEIVE_PROPOSAL_VOTE_RESULTS(null, error));
      throw error;
    });
};

export const onAuthorizeVote = (email, token, version) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_AUTHORIZE_VOTE({ token }));
    return api
      .proposalAuthorizeOrRevokeVote(csrf, "authorize", token, email, version)
      .then((response) =>
        dispatch(
          act.RECEIVE_AUTHORIZE_VOTE({ ...response, token, success: true })
        )
      )
      .catch((error) => {
        dispatch(act.RECEIVE_AUTHORIZE_VOTE(null, error));
        throw error;
      });
  });

export const onRevokeVote = (email, token, version) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_REVOKE_AUTH_VOTE({ token }));
    return api
      .proposalAuthorizeOrRevokeVote(csrf, "revoke", token, email, version)
      .then((response) =>
        dispatch(
          act.RECEIVE_REVOKE_AUTH_VOTE({ ...response, token, success: true })
        )
      )
      .catch((error) => {
        dispatch(act.RECEIVE_REVOKE_AUTH_VOTE(null, error));
        throw error;
      });
  });

export const onFetchProposalPaywallPayment = () => (dispatch) => {
  dispatch(act.REQUEST_PROPOSAL_PAYWALL_PAYMENT());
  return api
    .proposalPaywallPayment()
    .then((response) =>
      dispatch(act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT(response))
    )
    .catch((error) => {
      dispatch(act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT(null, error));
      throw error;
    });
};

const maxRequestLimit = 6;
let numOfRequests = 0;

let globalProposalPaymentPollingPointer = null;

export const clearProposalPaymentPollingPointer = () => {
  if (globalProposalPaymentPollingPointer) {
    clearTimeout(globalProposalPaymentPollingPointer);
  }
};

export const setProposalPaymentPollingPointer = (proposalPaymentPolling) =>
  (globalProposalPaymentPollingPointer = proposalPaymentPolling);

export const onPollProposalPaywallPayment = (isLimited) => (
  dispatch,
  getState
) => {
  const proposalPaymentReceived = sel.proposalPaymentReceived(getState());
  if (proposalPaymentReceived) {
    clearProposalPaymentPollingPointer();
    dispatch(act.TOGGLE_CREDITS_PAYMENT_POLLING(false));
    return;
  }
  dispatch(act.REQUEST_PROPOSAL_PAYWALL_PAYMENT());
  return api
    .proposalPaywallPayment()
    .then((response) => {
      if (isLimited && !response.txid) {
        numOfRequests++;
      }
      if (!isLimited || numOfRequests < maxRequestLimit) {
        const paymentpolling = setTimeout(
          () => dispatch(onPollProposalPaywallPayment(isLimited)),
          POLL_INTERVAL
        );
        setProposalPaymentPollingPointer(paymentpolling);
      } else if (isLimited && numOfRequests === maxRequestLimit) {
        dispatch(act.TOGGLE_CREDITS_PAYMENT_POLLING_REACHED_LIMIT(true));
        dispatch(act.TOGGLE_CREDITS_PAYMENT_POLLING(false));
      }
      return response;
    })
    .then((response) =>
      dispatch(act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT(response))
    )
    .catch((error) => {
      dispatch(act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT(null, error));
      throw error;
    });
};

export const onRescanUserPayments = (userid) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_RESCAN_USER_PAYMENTS(userid));
    return api
      .rescanUserPayments(csrf, userid)
      .then((response) => {
        dispatch(act.RECEIVE_RESCAN_USER_PAYMENTS({ ...response, userid }));
      })
      .catch((error) => {
        dispatch(act.RECEIVE_RESCAN_USER_PAYMENTS(null, error));
        throw error;
      });
  });

export const onGeneratePayouts = () =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_GENERATE_PAYOUTS({}));
    return api
      .generatePayouts(csrf)
      .then((response) => {
        dispatch(act.RECEIVE_GENERATE_PAYOUTS(response));
      })
      .catch((error) => {
        dispatch(act.RECEIVE_GENERATE_PAYOUTS(null, error));
      });
  });

export const onInvoicePayouts = (start, end) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_INVOICE_PAYOUTS({}));
    return api
      .invoicePayouts(csrf, start, end)
      .then((response) => {
        dispatch(act.RECEIVE_INVOICE_PAYOUTS(response));
      })
      .catch((error) => {
        dispatch(act.RECEIVE_INVOICE_PAYOUTS(null, error));
      });
  });

export const onPayApprovedInvoices = () => (dispatch) => {
  dispatch(act.REQUEST_PAY_APPROVED({}));
  return api
    .payApprovedInvoices()
    .then((response) => {
      dispatch(act.RECEIVE_PAY_APPROVED(response));
    })
    .catch((error) => {
      dispatch(act.RECEIVE_PAY_APPROVED(null, error));
    });
};

export const onFetchExchangeRate = (month, year) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_EXCHANGE_RATE({ month, year }));
    return api
      .exchangeRate(csrf, +month, +year)
      .then((response) => {
        dispatch(act.RECEIVE_EXCHANGE_RATE({ ...response, month, year }));
        return response;
      })
      .catch((error) => {
        dispatch(act.RECEIVE_EXCHANGE_RATE(null, error));
        throw error;
      });
  });
