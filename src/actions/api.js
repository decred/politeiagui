import Promise from "promise";
import { PROPOSAL_STATUS_PUBLIC } from "../constants";
import * as api from "../lib/api";
import {
  resetNewInvoiceData,
  resetNewProposalData,
  resetNewDccData
} from "../lib/editors_content_backup";
import { clearStateLocalStorage } from "../lib/local_storage";
import * as pki from "../lib/pki";
import * as sel from "../selectors";
import act from "./methods";
import { PAYWALL_STATUS_PAID, DCC_SUPPORT_VOTE } from "../constants";

export const onResetNewUser = act.RESET_NEW_USER;

export const onResetRescanUserPayments = (userid) => (dispatch) =>
  dispatch(act.RESET_RESCAN_USER_PAYMENTS(userid));

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

let globalpollingpointer = null;

export const clearPollingPointer = () => clearTimeout(globalpollingpointer);
export const setPollingPointer = (paymentpolling) => {
  globalpollingpointer = paymentpolling;
};

const POLL_INTERVAL = 10 * 1000;
export const onPollUserPayment = () => (dispatch, getState) => {
  const userid = sel.currentUserID(getState());
  return api
    .verifyUserPayment()
    .then((response) => response.haspaid)
    .then((verified) => {
      if (verified) {
        dispatch(
          act.UPDATE_USER_PAYWALL_STATUS({
            status: PAYWALL_STATUS_PAID,
            userid
          })
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

export const onInviteUserConfirm = ({ email, isTemp }) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_INVITE_USER({ email }));
    return api
      .inviteNewUser(csrf, { email, temp: isTemp })
      .then((response) => {
        dispatch(act.RECEIVE_INVITE_USER(response));
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
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_NEW_USER({ email }));
    return api
      .newUser(csrf, email, username, password)
      .then((response) => {
        dispatch(act.RECEIVE_NEW_USER(response));
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
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_NEW_USER({ email }));
    return api
      .register(csrf, email, username, password, verificationtoken)
      .then((response) => {
        dispatch(act.RECEIVE_NEW_USER(response));
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

export const onVerifyNewUser = (email, verificationToken, username) => (
  dispatch
) => {
  dispatch(act.REQUEST_VERIFY_NEW_USER({ email, verificationToken }));
  return api
    .verifyNewUser(email, verificationToken, username)
    .then((res) => dispatch(act.RECEIVE_VERIFY_NEW_USER(res)))
    .catch((err) => {
      dispatch(act.RECEIVE_VERIFY_NEW_USER(null, err));
      throw err;
    });
};

export const onSearchUser = (query, isCMS) => (dispatch) => {
  dispatch(act.REQUEST_USER_SEARCH());
  const apiReq = !isCMS ? api.searchUser(query) : api.searchCmsUsers(query);
  return apiReq
    .then((res) => dispatch(act.RECEIVE_USER_SEARCH({ ...res, query })))
    .catch((err) => {
      dispatch(act.RECEIVE_USER_SEARCH(null, err));
      throw err;
    });
};

// onLogin handles a user's login. If it is his first login on the app
// after registering, his key will be saved under his email. If so, it
// changes the storage key to his uuid.
export const onLogin = ({ email, password }) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_LOGIN({ email }));
    return api
      .login(csrf, email, password)
      .then((response) => {
        dispatch(act.RECEIVE_LOGIN(response));
        const { userid, username } = response;
        pki.needStorageKeyReplace(email, username).then((keyNeedsReplace) => {
          if (keyNeedsReplace) {
            pki.replaceStorageKey(keyNeedsReplace, userid);
          }
          return response;
        });
      })
      .then(() => dispatch(onRequestMe()))
      .catch((error) => {
        dispatch(act.RECEIVE_LOGIN(null, error));
        throw error;
      });
  });

// handleLogout calls the correct logout handler according to the user selected
// option between a normal logout or a permanent logout.
export const handleLogout = (isPermanent, userid) => (dispatch) =>
  isPermanent
    ? dispatch(handlePermanentLogout(userid))
    : dispatch(handleNormalLogout);

// handleNormalLogout handles all the procedure to be done once the user is logged out.
// It can be called either when the logout request has been successful or when the
// session has already expired
export const handleNormalLogout = () => {
  clearStateLocalStorage();
  clearPollingPointer();
  clearProposalPaymentPollingPointer();
};

// handlePermanentLogout handles the logout procedures while deleting all user related
// information from the browser storage and cache.
export const handlePermanentLogout = async (userid) => {
  await pki.removeKeys(userid);
  clearStateLocalStorage(userid);
  clearPollingPointer();
  clearProposalPaymentPollingPointer();
};

export const onLogout = (isCMS, isPermanent) =>
  withCsrf((dispatch, getState, csrf) => {
    const userid = sel.currentUserID(getState());
    dispatch(act.REQUEST_LOGOUT());
    return api
      .logout(csrf)
      .then((response) => {
        isCMS
          ? dispatch(act.RECEIVE_CMS_LOGOUT(response))
          : dispatch(act.RECEIVE_LOGOUT(response));
        dispatch(handleLogout(isPermanent, userid));
      })
      .catch((error) => {
        dispatch(act.RECEIVE_LOGOUT(null, error));
      });
  });

export const onChangeUsername = (password, newUsername) =>
  withCsrf((dispatch, _, csrf) => {
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
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_CHANGE_PASSWORD());
    return api
      .changePassword(csrf, password, newPassword)
      .then((response) => dispatch(act.RECEIVE_CHANGE_PASSWORD(response)))
      .catch((error) => {
        dispatch(act.RECEIVE_CHANGE_PASSWORD(null, error));
        throw error;
      });
  });

export const onFetchUserInvoices = () => (dispatch) => {
  dispatch(act.REQUEST_USER_INVOICES());
  return api
    .userInvoices()
    .then((response) => dispatch(act.RECEIVE_USER_INVOICES(response)))
    .catch((error) => {
      dispatch(act.RECEIVE_USER_INVOICES(null, error));
      throw error;
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

export const onFetchProposalsBatchWithoutState = (
  tokens,
  fetchProposals = true,
  fetchVoteSummary = true
) =>
  withCsrf(async (_, __, csrf) => {
    const res = await Promise.all([
      fetchProposals && api.proposalsBatch(csrf, tokens),
      fetchVoteSummary && api.proposalsBatchVoteSummary(csrf, tokens)
    ]);
    const proposals =
      fetchProposals && res.find((res) => res && res.proposals).proposals;
    const summaries =
      fetchVoteSummary && res.find((res) => res && res.summaries).summaries;
    return [proposals, summaries];
  });

export const onFetchProposalsBatch = (tokens, fetchVoteSummary = true) =>
  withCsrf(async (dispatch, _, csrf) => {
    dispatch(act.REQUEST_PROPOSALS_BATCH(tokens));
    try {
      const promises = [api.proposalsBatch(csrf, tokens)];
      if (fetchVoteSummary) {
        promises.push(dispatch(onFetchProposalsBatchVoteSummary(tokens)));
      }
      const response = await Promise.all(promises);
      const proposals = response.find((res) => res && res.proposals).proposals;
      const summaries =
        fetchVoteSummary &&
        response.find((res) => res && res.summaries).summaries;
      dispatch(act.RECEIVE_PROPOSALS_BATCH({ proposals }));
      return [proposals, summaries];
    } catch (e) {
      dispatch(act.RECEIVE_PROPOSALS_BATCH(null, e));
    }
  });

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
            act.RECEIVE_INVOICE(
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
  withCsrf((dispatch, _, csrf) => {
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
  withCsrf((dispatch, _, csrf) => {
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

const filterFalsy = (obj) =>
  Object.entries(obj).reduce(
    (acc, [key, value]) => (value ? ((acc[key] = value), acc) : acc),
    {}
  );

export const onEditCmsUser = (cmsUserInfo) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_EDIT_CMS_USER(cmsUserInfo));
    return api
      .editUser(csrf, cmsUserInfo)
      .then((response) => {
        dispatch(
          act.RECEIVE_EDIT_CMS_USER({
            ...response,
            ...filterFalsy(cmsUserInfo)
          })
        );
      })
      .catch((error) => {
        dispatch(act.RECEIVE_EDIT_CMS_USER(null, error));
      });
  });

export const onManageCmsUser = (userID, domain, type, supervisorIDs) =>
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

export const onManageUser = (userId, action, reason) =>
  withCsrf((dispatch, _, csrf) => {
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
      .then((invoice) => api.signRegister(userid, invoice))
      .then((invoice) => api.newInvoice(csrf, invoice))
      .then((invoice) => {
        const policy = sel.policy(getState());
        dispatch(
          act.RECEIVE_NEW_INVOICE({
            ...invoice,
            numcomments: 0,
            userid,
            username
          })
        );
        resetNewInvoiceData(policy);
      })
      .catch((error) => {
        dispatch(act.RECEIVE_NEW_INVOICE(null, error));
        resetNewProposalData();
        throw error;
      });
  });

export const onSubmitProposal = (
  userid,
  username,
  name,
  description,
  rfpDeadline,
  type,
  rfpLink,
  files
) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(
      act.REQUEST_NEW_PROPOSAL({
        name,
        description,
        rfpDeadline,
        type,
        rfpLink,
        files
      })
    );
    return Promise.resolve(
      api.makeProposal(name, description, rfpDeadline, type, rfpLink, files)
    )
      .then((proposal) => api.signRegister(userid, proposal))
      .then((proposal) => api.newProposal(csrf, proposal))
      .then((proposal) => {
        dispatch(
          act.RECEIVE_NEW_PROPOSAL({
            ...proposal,
            numcomments: 0,
            userid,
            username,
            name,
            description,
            type,
            rfpLink,
            files
          })
        );
        resetNewProposalData();
      })
      .catch((error) => {
        dispatch(act.RECEIVE_NEW_PROPOSAL(null, error));
        resetNewProposalData();
        throw error;
      });
  });

export const onSubmitEditedProposal = (
  userid,
  name,
  description,
  rfpDeadline,
  type,
  rfpLink,
  files,
  token
) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(
      act.REQUEST_EDIT_PROPOSAL({
        name,
        description,
        files,
        rfpDeadline,
        rfpLink,
        type
      })
    );
    return Promise.resolve(
      api.makeProposal(name, description, rfpDeadline, type, rfpLink, files)
    )
      .then((proposal) => api.signRegister(userid, proposal))
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
  withCsrf((dispatch, getState, csrf) => {
    const policy = sel.policy(getState());
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
      .then((invoice) => api.signRegister(userid, invoice))
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
        resetNewInvoiceData(policy);
      })
      .catch((error) => {
        dispatch(act.RECEIVE_EDIT_INVOICE(null, error));
        resetNewInvoiceData(policy);
        throw error;
      });
  });

export const onLikeComment = (currentUserID, token, commentid, action) =>
  withCsrf((dispatch, _, csrf) => {
    if (!currentUserID) {
      return;
    }
    dispatch(act.REQUEST_LIKE_COMMENT({ commentid, token }));
    return Promise.resolve(api.makeLikeComment(token, action, commentid))
      .then((comment) => api.signLikeComment(currentUserID, comment))
      .then((comment) => api.likeComment(csrf, comment))
      .then(() => {
        dispatch(act.RECEIVE_LIKE_COMMENT({ token }));
        dispatch(act.RECEIVE_SYNC_LIKE_COMMENT({ token, commentid, action }));
      })
      .catch((error) => {
        dispatch(act.RESET_SYNC_LIKE_COMMENT({ token }));
        dispatch(act.RECEIVE_LIKE_COMMENT(null, error));
      });
  });

export const onCensorComment = (userid, token, commentid, reason) => {
  return withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_CENSOR_COMMENT({ commentid, token }));
    return Promise.resolve(api.makeCensoredComment(token, reason, commentid))
      .then((comment) => api.signCensorComment(userid, comment))
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

export const onSubmitComment = (currentUserID, token, comment, parentid) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_NEW_COMMENT({ token, comment, parentid }));
    return Promise.resolve(api.makeComment(token, comment, parentid))
      .then((comment) => api.signComment(currentUserID, comment))
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
      .then((comment) => {
        return api.newComment(csrf, comment);
      })
      .then((response) => {
        const responsecomment = response.comment;
        dispatch(act.RECEIVE_NEW_COMMENT(responsecomment));
        return;
      })
      .catch((error) => {
        dispatch(act.RECEIVE_NEW_COMMENT(null, error));
        throw error;
      });
  });

export const onUpdateUserKey = (currentUserID) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_UPDATED_KEY());
    return pki
      .generateKeys()
      .then((keys) =>
        pki.loadKeys(currentUserID, keys).then(() =>
          api
            .updateKeyRequest(csrf, pki.toHex(keys.publicKey))
            .then((response) => {
              const { verificationtoken } = response;
              if (verificationtoken) {
                const isTestnet = sel.isTestNet(getState());
                if (isTestnet) {
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

export const onVerifyUserKey = (currentUserID, verificationtoken) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_VERIFIED_KEY({ verificationtoken }));
    return api
      .verifyKeyRequest(csrf, currentUserID, verificationtoken)
      .then((response) =>
        pki.myPubKeyHex(currentUserID).then((pubkey) => {
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
    const userid = sel.currentUserID(getState());
    dispatch(
      act.REQUEST_SETSTATUS_INVOICE({ status, token, reason, version, userid })
    );
    return api
      .invoiceSetStatus(userid, csrf, token, version, status, reason)
      .then(({ invoice }) => {
        dispatch(act.RECEIVE_SETSTATUS_INVOICE(invoice));
      })
      .catch((error) => {
        dispatch(act.RECEIVE_SETSTATUS_INVOICE(null, error));
        throw error;
      });
  });

export const onSetProposalStatus = ({
  token,
  status,
  linkto,
  censorMessage = ""
}) =>
  withCsrf((dispatch, getState, csrf) => {
    const userid = sel.currentUserID(getState());
    dispatch(act.REQUEST_SETSTATUS_PROPOSAL({ status, token }));
    return api
      .proposalSetStatus(userid, csrf, token, status, censorMessage)
      .then(({ proposal }) => {
        dispatch(
          act.RECEIVE_SETSTATUS_PROPOSAL({
            proposal
          })
        );
        if (status === PROPOSAL_STATUS_PUBLIC) {
          dispatch(onFetchProposalsBatchVoteSummary([token]));
          if (linkto) {
            dispatch(onFetchProposalsBatch([linkto]));
          }
        }
      })
      .catch((error) => {
        dispatch(act.RECEIVE_SETSTATUS_PROPOSAL(null, error));
        throw error;
      });
  });

export const onResetPassword = ({ username, email }) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_RESET_PASSWORD({ username, email }));
    return api
      .resetPassword(csrf, username, email)
      .then((response) => {
        dispatch(act.RECEIVE_RESET_PASSWORD(response));
        return response;
      })
      .catch((error) => {
        dispatch(act.RECEIVE_RESET_PASSWORD(null, error));
        throw error;
      });
  });

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

export const onResendVerificationEmailConfirm = ({ username, email }) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_RESEND_VERIFICATION_EMAIL({ email }));
    return api
      .resendVerificationEmailRequest(csrf, email, username)
      .then((response) => {
        dispatch(act.RECEIVE_RESEND_VERIFICATION_EMAIL(response));
        return response;
      })
      .catch((error) => {
        dispatch(act.RECEIVE_RESEND_VERIFICATION_EMAIL(null, error));
        throw error;
      });
  });

export const resetResendVerificationEmail = () => (dispatch) =>
  dispatch(act.RESET_RESEND_VERIFICATION_EMAIL());

export const onStartVote = (userid, token, duration, quorum, pass, version) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_START_VOTE({ token }));
    return api
      .startVote(userid, csrf, token, duration, quorum, pass, version)
      .then((response) => {
        dispatch(onFetchProposalsBatchVoteSummary([token]));
        dispatch(act.RECEIVE_START_VOTE({ ...response, token, success: true }));
      })
      .catch((error) => {
        dispatch(act.RECEIVE_START_VOTE(null, error));
        throw error;
      });
  });

export const onStartRunoffVote = (
  currentUserID,
  token,
  duration,
  quorum,
  pass,
  votes
) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_START_RUNOFF_VOTE({ token }));
    return api
      .startRunoffVote(
        currentUserID,
        csrf,
        token,
        duration,
        quorum,
        pass,
        votes
      )
      .then((response) => {
        const submissionsTokens = votes.map((vote) => vote.token);
        dispatch(onFetchProposalsBatch([...submissionsTokens, token]));
        dispatch(
          act.RECEIVE_START_RUNOFF_VOTE({ ...response, token, success: true })
        );
      })
      .catch((error) => {
        dispatch(act.RECEIVE_START_RUNOFF_VOTE(null, error));
        throw error;
      });
  });

export const onFetchProposalPaywallDetails = () => (dispatch, getState) => {
  dispatch(act.REQUEST_PROPOSAL_PAYWALL_DETAILS());
  const userid = sel.currentUserID(getState());
  return api
    .proposalPaywallDetails()
    .then((response) =>
      dispatch(act.RECEIVE_PROPOSAL_PAYWALL_DETAILS({ ...response, userid }))
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

export const onFetchProposalVoteResults = (token) => (dispatch) => {
  dispatch(act.REQUEST_PROPOSAL_VOTE_RESULTS({ token }));
  return api
    .proposalVoteResults(token)
    .then((response) =>
      dispatch(
        act.RECEIVE_PROPOSAL_VOTE_RESULTS({ ...response, token, success: true })
      )
    )
    .catch((error) => {
      dispatch(act.RECEIVE_PROPOSAL_VOTE_RESULTS(null, error));
      throw error;
    });
};

export const onAuthorizeVote = (userid, token, version) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_AUTHORIZE_VOTE({ token }));
    return api
      .proposalAuthorizeOrRevokeVote(csrf, "authorize", token, userid, version)
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

export const onRevokeVote = (userid, token, version) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_REVOKE_AUTH_VOTE({ token }));
    return api
      .proposalAuthorizeOrRevokeVote(csrf, "revoke", token, userid, version)
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

export const onFetchProposalPaywallPayment = () => (dispatch, getState) => {
  const userid = sel.currentUserID(getState());
  dispatch(act.REQUEST_PROPOSAL_PAYWALL_PAYMENT());
  return api
    .proposalPaywallPayment()
    .then((response) =>
      dispatch(act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT({ ...response, userid }))
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
  const userid = sel.currentUserID(getState());
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
      dispatch(act.RECEIVE_PROPOSAL_PAYWALL_PAYMENT({ ...response, userid }))
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

export const onFetchUserSubcontractors = () =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_USER_SUBCONTRACTORS({}));
    return api
      .userSubcontractors(csrf)
      .then((response) => {
        dispatch(act.RECEIVE_USER_SUBCONTRACTORS(response));
      })
      .catch((error) => {
        dispatch(act.RECEIVE_USER_SUBCONTRACTORS(null, error));
      });
  });

export const onFetchCmsUsers = () =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_CMS_USERS({}));
    return api
      .cmsUsers(csrf)
      .then((response) => {
        dispatch(act.RECEIVE_CMS_USERS(response));
      })
      .catch((error) => {
        dispatch(act.RECEIVE_CMS_USERS(null, error));
      });
  });

// DCC actions

export const onSubmitNewDcc = (
  currentUserID,
  username,
  type,
  nomineeuserid,
  statement,
  domain,
  contractortype
) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_NEW_DCC({}));
    return Promise.resolve(
      api.makeDCC(type, nomineeuserid, statement, domain, contractortype)
    )
      .then((dcc) => api.signDcc(currentUserID, dcc))
      .then((dcc) => api.newDcc(csrf, dcc))
      .then((dcc) => {
        dispatch(
          act.RECEIVE_NEW_DCC({
            ...dcc,
            numcomments: 0,
            currentUserID,
            username
          })
        );
        resetNewDccData();
      })
      .catch((error) => {
        dispatch(act.RECEIVE_NEW_DCC(null, error));
        throw error;
      });
  });

export const onFetchDccsByStatus = (status) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_DCCS({}));
    return api
      .dccsByStatus(csrf, { status })
      .then((response) => {
        dispatch(act.RECEIVE_DCCS({ ...response, status }));
      })
      .catch((error) => {
        dispatch(act.RECEIVE_DCCS(null, error));
      });
  });

export const onFetchDcc = (token) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_DCC({}));
    return api
      .dccDetails(csrf, token)
      .then((response) => {
        dispatch(act.RECEIVE_DCC(response));
      })
      .catch((error) => {
        dispatch(act.RECEIVE_DCC(null, error));
      });
  });

export const onFetchDccComments = (token) => (dispatch) => {
  dispatch(act.REQUEST_RECORD_COMMENTS());
  return api
    .dccComments(token)
    .then((response) => {
      dispatch(act.RECEIVE_RECORD_COMMENTS({ ...response, token }));
    })
    .catch((error) => {
      dispatch(act.RECEIVE_RECORD_COMMENTS(null, error));
      throw error;
    });
};

export const onSupportOpposeDcc = (token, vote) =>
  withCsrf((dispatch, getState, csrf) => {
    const { username, userid } = sel.currentUser(getState());
    dispatch(act.REQUEST_SUPPORT_OPPOSE_DCC({}));
    return Promise.resolve(api.makeDCCVote(token, vote))
      .then((dccvote) => api.signDccVote(userid, dccvote))
      .then((dccvote) => api.supportOpposeDCC(csrf, dccvote))
      .then((response) => {
        dispatch(
          act.RECEIVE_SUPPORT_OPPOSE_DCC({
            ...response,
            token,
            username,
            userid,
            isSupport: vote === DCC_SUPPORT_VOTE
          })
        );
      })
      .catch((error) => {
        dispatch(act.RECEIVE_SUPPORT_OPPOSE_DCC(null, error));
      });
  });

export const onSetDccStatus = (token, status, reason) =>
  withCsrf((dispatch, getState, csrf) => {
    const userid = sel.currentUserID(getState());
    if (!userid) {
      return;
    }
    dispatch(act.REQUEST_SET_DCC_STATUS({}));
    return api
      .setDCCStatus(csrf, userid, token, status, reason)
      .then((response) => {
        dispatch(
          act.RECEIVE_SET_DCC_STATUS({ ...response, status, reason, token })
        );
      })
      .catch((error) => {
        dispatch(act.RECEIVE_SET_DCC_STATUS(null, error));
      });
  });

export const onSubmitDccComment = (currentUserID, token, comment, parentid) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_NEW_COMMENT({ token, comment, parentid }));
    return Promise.resolve(api.makeComment(token, comment, parentid))
      .then((comment) => api.signComment(currentUserID, comment))
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
      .then((comment) => api.newDccComment(csrf, comment))
      .then((response) => {
        const responsecomment = response.comment;
        dispatch(act.RECEIVE_NEW_COMMENT(responsecomment));
      })
      .catch((error) => {
        dispatch(act.RECEIVE_NEW_COMMENT(null, error));
        throw error;
      });
  });
