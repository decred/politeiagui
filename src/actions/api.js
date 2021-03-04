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
import {
  PAYWALL_STATUS_PAID,
  DCC_SUPPORT_VOTE,
  TOTP_DEFAULT_TYPE,
  PROPOSAL_STATE_VETTED,
  PROPOSAL_STATE_UNVETTED,
  UNREVIEWED,
  CENSORED,
  PRE_VOTE,
  ACTIVE_VOTE,
  APPROVED,
  REJECTED,
  INELIGIBLE,
  ARCHIVED
} from "../constants";
import { parseReceivedProposalsMap, parseRawProposal } from "src/helpers";

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

export const onRequestMe = () => (dispatch, getState) => {
  dispatch(act.REQUEST_ME());
  const isCMS = sel.isCMS(getState());
  return api
    .me()
    .then((response) => {
      dispatch(act.RECEIVE_ME(response));
      // fetch CMS user details if needed
      isCMS && response.userid && dispatch(onFetchUser(response.userid));
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
export const onLogin = ({ email, password, code }) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_LOGIN({ email }));
    return api
      .login(csrf, email, password, code)
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
      .then(() => {
        dispatch(onRequestMe());
      })
      .catch((error) => {
        dispatch(act.RECEIVE_LOGIN(null, error));
        throw error;
      });
  });

// handleLogout calls the correct logout handler according to the user selected
// option between a normal logout or a permanent logout.
export const handleLogout = (isPermanent, userid) => () =>
  isPermanent ? handlePermanentLogout(userid) : handleNormalLogout;

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
export const handlePermanentLogout = (userid) =>
  pki.removeKeys(userid).then(() => {
    clearStateLocalStorage(userid);
    clearPollingPointer();
    clearProposalPaymentPollingPointer();
  });

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
      })
      .then(() => handleLogout(isPermanent, userid))
      .catch((error) => {
        dispatch(act.RECEIVE_LOGOUT(null, error));
        throw error;
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
      dispatch(act.RECEIVE_RECORD_COMMENTS(null, error));
      throw error;
    });
};

export const onFetchAdminInvoices = (start, end, userid) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_ADMIN_INVOICES());
    return api
      .adminInvoices(csrf, start, end, userid)
      .then((response) => dispatch(act.RECEIVE_ADMIN_INVOICES(response)))
      .catch((error) => {
        dispatch(act.RECEIVE_ADMIN_INVOICES(null, error));
        throw error;
      });
  });

export const onFetchUserCodeStats = (userid, start, end) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_CODE_STATS());
    return api
      .codeStats(csrf, userid, start, end)
      .then((response) =>
        dispatch(
          act.RECEIVE_CODE_STATS({
            userid,
            codestats: response.repostats,
            start,
            end
          })
        )
      )
      .catch((error) => {
        dispatch(act.RECEIVE_CODE_STATS(null, error));
      });
  });

export const onFetchAdminInvoicesWithoutState = (start, end, userid) =>
  withCsrf(async (_, __, csrf) => {
    const res = await api.adminInvoices(csrf, start, end, userid);
    return res.invoices;
  });

export const onFetchProposalBilling = (token) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_PROPOSAL_BILLING());
    return api
      .proposalBilling(csrf, token)
      .then((response) =>
        dispatch(act.RECEIVE_PROPOSAL_BILLING({ token, response }))
      )
      .catch((error) => {
        dispatch(act.RECEIVE_PROPOSAL_BILLING(null, error));
      });
  });

// state should be the state of requested proposals
// XXX ensure all ref. call with state provided
// XXX and includefiles param
export const onFetchProposalsBatchWithoutState = (
  tokens,
  state,
  fetchProposals = true,
  fetchVoteSummary = true
) =>
  withCsrf(async (_, __, csrf) => {
    const res = await Promise.all([
      fetchProposals &&
        api.proposalsBatch(csrf, {
          tokens,
          state,
          includefiles: true
        }),
      fetchVoteSummary && api.proposalsBatchVoteSummary(csrf, tokens)
    ]);
    const proposals =
      fetchProposals && res.find((res) => res && res.proposals).proposals;
    const parsedProposals = proposals && parseReceivedProposalsMap(proposals);
    const summaries =
      fetchVoteSummary && res.find((res) => res && res.summaries).summaries;
    return [parsedProposals, summaries];
  });

export const onFetchProposalDetailsWithoutState = (
  token,
  state,
  version
) => async () => {
  const res = await api.proposalDetails({ token, state, version });
  return res.record;
};

// state should be the state of requested proposals
export const onFetchProposalsBatch = (tokens, state, fetchVoteSummary = true) =>
  withCsrf(async (dispatch, _, csrf) => {
    dispatch(act.REQUEST_PROPOSALS_BATCH(tokens));
    try {
      const response = await Promise.all([
        api.proposalsBatch(csrf, {
          tokens,
          state
        }),
        fetchVoteSummary && dispatch(onFetchProposalsBatchVoteSummary(tokens)),
        api.commentsCount(tokens, state)
      ]);
      const proposals = response.find((res) => res && res.proposals).proposals;
      const summaries =
        fetchVoteSummary &&
        response.find((res) => res && res.summaries).summaries;
      const commentsCount = response.find((res) => res && res.counts).counts;
      const proposalsWithCommentsCount = Object.keys(proposals).reduce(
        (acc, curr) => {
          return {
            ...acc,
            [curr]: { ...proposals[curr], commentsCount: commentsCount[curr] }
          };
        },
        {}
      );
      dispatch(
        act.RECEIVE_PROPOSALS_BATCH({ proposals: proposalsWithCommentsCount })
      );
      return [proposals, summaries];
    } catch (e) {
      dispatch(act.RECEIVE_PROPOSALS_BATCH(null, e));
      throw e;
    }
  });

export const onFetchProposalDetails = (token, state, version) => async (
  dispatch
) => {
  dispatch(act.REQUEST_PROPOSALS_BATCH(token));
  try {
    const response = await Promise.all([
      api.proposalDetails({ token, state, version }),
      api.commentsCount([token], state)
    ]);
    const record = response.find((res) => res && res.record).record;
    const commentsCount = response.find((res) => res && res.counts).counts;
    const { linkby } = parseRawProposal(record);
    if (linkby) {
      const { submissions } = await api.proposalSubmissions(token);
      dispatch(
        act.RECEIVE_PROPOSALS_BATCH({
          proposals: {
            [token]: {
              ...record,
              linkedfrom: submissions,
              commentsCount: commentsCount[token]
            }
          }
        })
      );
    } else {
      dispatch(
        act.RECEIVE_PROPOSALS_BATCH({
          proposals: {
            [token]: {
              ...record,
              commentsCount: commentsCount[token]
            }
          }
        })
      );
    }
    return response.record;
  } catch (e) {
    act.RECEIVE_PROPOSALS_BATCH(null, e);
    throw e;
  }
};

export const onFetchTokenInventory = (
  state,
  status,
  page = 0,
  isVoteStatus
) => async (dispatch) => {
  dispatch(act.REQUEST_TOKEN_INVENTORY());
  try {
    return await Promise.all([
      !isVoteStatus && api.proposalsInventory(state, status, page),
      isVoteStatus &&
        state !== PROPOSAL_STATE_UNVETTED &&
        api.votesInventory(status, page)
    ]).then(([proposals, votes]) => {
      const byRecords = {
        [UNREVIEWED]:
          (proposals && proposals.unvetted && proposals.unvetted.unreviewed) ||
          [],
        [CENSORED]: [
          ...((proposals &&
            proposals.unvetted &&
            proposals.unvetted.censored) ||
            []),
          ...((proposals && proposals.vetted && proposals.vetted.censored) ||
            [])
        ],
        [ARCHIVED]: [
          ...((proposals && proposals.vetted && proposals.vetted.archived) ||
            []),
          ...((proposals &&
            proposals.unvetted &&
            proposals.unvetted.archived) ||
            [])
        ]
      };
      const byVotes = {
        [PRE_VOTE]: [
          ...((votes && votes.vetted && votes.vetted.authorized) || []),
          ...((votes && votes.vetted && votes.vetted.unauthorized) || [])
        ],
        [ACTIVE_VOTE]: (votes && votes.vetted && votes.vetted.started) || [],
        [APPROVED]: (votes && votes.vetted && votes.vetted.approved) || [],
        [REJECTED]: (votes && votes.vetted && votes.vetted.rejected) || [],
        [INELIGIBLE]: (votes && votes.vetted && votes.vetted.ineligible) || []
      };
      dispatch(act.RECEIVE_RECORDS_INVENTORY(byRecords));
      dispatch(act.RECEIVE_VOTES_INVENTORY(byVotes));
      return { records: byRecords, votes: byVotes };
    });
  } catch (error) {
    dispatch(act.RECEIVE_VOTES_INVENTORY(null, error));
    throw error;
  }
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

export const onFetchUser = (userId) => (dispatch, getState) => {
  dispatch(act.REQUEST_USER(userId));
  const regexp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const valid = regexp.test(userId);
  if (!valid) {
    const error = new Error("This is not a valid user ID.");
    dispatch(act.RECEIVE_USER(null, error));
    throw error;
  }
  const isCMS = sel.isCMS(getState());
  return api
    .user(userId)
    .then((response) =>
      dispatch(
        act.RECEIVE_USER({
          user: {
            ...response.user,
            userid: userId,
            isCMS // used to identify whether user details request is for cms or pi
          }
        })
      )
    )
    .catch((error) => {
      dispatch(act.RECEIVE_USER(null, error));
      throw error;
    });
};

export const onFetchProposalComments = (token, state) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_RECORD_COMMENTS(token));
    return api
      .proposalComments(csrf, token, state)
      .then((response) =>
        dispatch(act.RECEIVE_RECORD_COMMENTS({ ...response, token }))
      )
      .catch((error) => {
        dispatch(act.RECEIVE_RECORD_COMMENTS(null, error));
      });
  });

export const onFetchLikedComments = (token, userid, state) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_LIKED_COMMENTS(token));
    return api
      .likedComments(csrf, token, userid, state)
      .then((response) =>
        dispatch(act.RECEIVE_LIKED_COMMENTS({ ...response, token }))
      )
      .catch((error) => {
        dispatch(act.RECEIVE_LIKED_COMMENTS(null, error));
      });
  });

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

export const onManageCmsUser = (
  userID,
  domain,
  type,
  supervisorIDs,
  proposalsOwned
) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_MANAGE_CMS_USER());
    return api
      .manageCmsUser(csrf, userID, domain, type, supervisorIDs, proposalsOwned)
      .then((response) =>
        dispatch(
          act.RECEIVE_MANAGE_CMS_USER({
            ...response,
            userID,
            domain,
            type,
            supervisorIDs,
            proposalsOwned
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
      .then((proposal) => {
        return api.signRegister(userid, proposal);
      })
      .then((proposal) => api.newProposal(csrf, proposal))
      .then(({ record }) => {
        dispatch(
          act.RECEIVE_NEW_PROPOSAL({
            ...record,
            comments: 0,
            userid,
            username,
            name,
            description,
            type
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
  token,
  state
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
      .then((proposal) => api.editProposal(csrf, { ...proposal, token, state }))
      .then(({ record }) => {
        dispatch(act.RECEIVE_EDIT_PROPOSAL({ proposal: record }));
        resetNewProposalData();
        return record.censorshiprecord.token;
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

export const onCommentVote = (currentUserID, token, commentid, vote) =>
  withCsrf((dispatch, _, csrf) => {
    if (!currentUserID) {
      return;
    }
    dispatch(act.REQUEST_LIKE_COMMENT({ commentid, token }));
    return Promise.resolve(api.makeCommentVote(token, vote, commentid))
      .then((comment) => api.signCommentVote(currentUserID, comment))
      .then((comment) => api.commentVote(csrf, comment))
      .then(() => {
        dispatch(act.RECEIVE_LIKE_COMMENT({ token }));
        dispatch(act.RECEIVE_SYNC_LIKE_COMMENT({ token, commentid, vote }));
      })
      .catch((error) => {
        dispatch(act.RESET_SYNC_LIKE_COMMENT({ token }));
        dispatch(act.RECEIVE_LIKE_COMMENT(null, error));
      });
  });

export const onCensorComment = (userid, token, commentid, state, reason) => {
  return withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_CENSOR_COMMENT({ commentid, token, state }));
    return Promise.resolve(
      api.makeCensoredComment(state, token, reason, commentid)
    )
      .then((comment) => api.signCensorComment(userid, comment))
      .then((comment) => api.censorComment(csrf, comment))
      .then(({ comment: { receipt, commentid, token } }) => {
        if (receipt) {
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
  currentUserID,
  token,
  commentText,
  parentid,
  state
) =>
  withCsrf((dispatch, getState, csrf) => {
    const comment = api.makeComment(token, commentText, parentid, state);
    dispatch(act.REQUEST_NEW_COMMENT(comment));
    return Promise.resolve(api.signComment(currentUserID, comment))
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
        return dispatch(act.RECEIVE_NEW_COMMENT(responsecomment));
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
  version,
  state,
  reason = ""
}) =>
  withCsrf((dispatch, getState, csrf) => {
    const userid = sel.currentUserID(getState());
    dispatch(act.REQUEST_SETSTATUS_PROPOSAL({ status, token }));
    return api
      .proposalSetStatus(userid, csrf, token, status, version, state, reason)
      .then(({ record: proposal }) => {
        dispatch(
          act.RECEIVE_SETSTATUS_PROPOSAL({
            proposal
          })
        );
        if (status === PROPOSAL_STATUS_PUBLIC) {
          dispatch(onFetchProposalsBatchVoteSummary([token]));
          if (linkto) {
            dispatch(onFetchProposalsBatch([linkto], PROPOSAL_STATE_VETTED));
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

export const onStartVote = (userid, voteParams) =>
  withCsrf((dispatch, _, csrf) => {
    if (!voteParams || voteParams.length < 1) {
      throw Error("Invalid vote params");
    }
    const tokens = voteParams.map(({ token }) => token);
    const type = voteParams[0].type;
    dispatch(act.REQUEST_START_VOTE({ tokens, type }));
    return api
      .startVote(csrf, userid, voteParams)
      .then((response) => {
        dispatch(onFetchProposalsBatchVoteSummary(tokens));
        dispatch(
          act.RECEIVE_START_VOTE({ ...response, type, tokens, success: true })
        );
      })
      .catch((error) => {
        dispatch(act.RECEIVE_START_VOTE(null, error));
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

export const onFetchUserProposals = (userid) =>
  withCsrf(async (dispatch, getState, csrf) => {
    dispatch(act.REQUEST_USER_PROPOSALS({ userid }));
    try {
      const response = await api.userProposals(csrf, userid);
      const cachedUserProposals = sel.makeGetUserProposals(userid)(getState());
      const unvettedTokens = response.unvetted;
      const vettedTokens = response.vetted;
      const tokensLength = unvettedTokens.length + vettedTokens.length;

      let unvettedProposals = [];
      let vettedProposals = [];

      if (unvettedTokens.length) {
        const remainingTokens = unvettedTokens
          .filter(
            (t) =>
              !cachedUserProposals.find((up) => up.censorshiprecord.token === t)
          )
          .slice(0, 9);
        unvettedProposals = await dispatch(
          onFetchProposalsBatch(remainingTokens, PROPOSAL_STATE_UNVETTED, false)
        );
      }
      if (vettedTokens.length) {
        vettedProposals = await dispatch(
          onFetchProposalsBatch(vettedTokens, PROPOSAL_STATE_VETTED)
        );
      }
      // we access the first array position, which contains the proposals.
      // second array position refers to the vote summary results.
      const proposals = {
        ...unvettedProposals[0],
        ...vettedProposals[0]
      };

      dispatch(
        act.RECEIVE_USER_PROPOSALS({
          proposals,
          userid,
          numofproposals: tokensLength
        })
      );
    } catch (e) {
      dispatch(act.RECEIVE_USER_PROPOSALS(null, e));
      throw e;
    }
  });

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

export const onFetchProposalVoteResults = (token) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_PROPOSAL_VOTE_RESULTS({ token }));
    return api
      .proposalVoteResults(csrf, token)
      .then((response) =>
        dispatch(
          act.RECEIVE_PROPOSAL_VOTE_RESULTS({
            ...response,
            token,
            success: true
          })
        )
      )
      .catch((error) => {
        dispatch(act.RECEIVE_PROPOSAL_VOTE_RESULTS(null, error));
        throw error;
      });
  });

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
        throw error;
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
        throw error;
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
      throw error;
    });
};

export const onGetSpendingSummary = () => (dispatch) => {
  dispatch(act.REQUEST_SPENDING_SUMMARY({}));
  return api
    .getSpendingSummary()
    .then((response) => {
      dispatch(act.RECEIVE_SPENDING_SUMMARY(response));
    })
    .catch((error) => {
      dispatch(act.RECEIVE_SPENDING_SUMMARY(null, error));
      throw error;
    });
};

export const onFetchSpendingDetails = (token) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_SPENDING_DETAILS({ token }));
    return api
      .getSpendingDetails(csrf, token)
      .then((response) => {
        dispatch(act.RECEIVE_SPENDING_DETAILS({ ...response }));
        return response;
      })
      .catch((error) => {
        dispatch(act.RECEIVE_SPENDING_DETAILS(null, error));
        throw error;
      });
  });

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
        throw error;
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
        throw error;
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
        throw error;
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
        throw error;
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
        throw error;
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
        throw error;
      });
  });

export const onSubmitDccComment = (currentUserID, token, comment, parentid) =>
  withCsrf((dispatch, getState, csrf) => {
    dispatch(act.REQUEST_NEW_COMMENT({ token, comment, parentid }));
    return Promise.resolve(api.makeDccComment(token, comment, parentid))
      .then((comment) => api.signDccComment(currentUserID, comment))
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

export const onSetTotp = (code = "", type = TOTP_DEFAULT_TYPE) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_SET_TOTP({}));
    return api
      .setTotp(csrf, type, code)
      .then((response) => {
        dispatch(act.RECEIVE_SET_TOTP(response));
      })
      .catch((e) => {
        dispatch(act.RECEIVE_SET_TOTP(null, e));
        throw e;
      });
  });

export const onVerifyTotp = (code) =>
  withCsrf((dispatch, _, csrf) => {
    dispatch(act.REQUEST_VERIFY_TOTP({}));
    return api
      .verifyTotp(csrf, code)
      .then((response) => {
        dispatch(act.RECEIVE_VERIFY_TOTP(response));
      })
      .catch((e) => {
        dispatch(act.RECEIVE_VERIFY_TOTP(null, e));
        throw e;
      });
  });
// Records Actions
export const onFetchRecordTimestamps = (
  token,
  state = PROPOSAL_STATE_VETTED,
  version
) =>
  withCsrf((__, _, csrf) => api.recordsTimestamp(csrf, token, state, version));

// Comments Actions
export const onFetchCommentsTimestamps = (token, state, commentsids) =>
  withCsrf((__, _, csrf) =>
    api.commentsTimestamps(csrf, token, state, commentsids)
  );

// Ticket Vote actions
export const onFetchTicketVoteTimestamps = (token, votespage) =>
  withCsrf((__, _, csrf) => api.ticketVoteTimestamps(csrf, token, votespage));
