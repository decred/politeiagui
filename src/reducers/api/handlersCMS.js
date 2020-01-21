import cloneDeep from "lodash/cloneDeep";
import get from "lodash/fp/get";
import map from "lodash/fp/map";
import { receive, reset } from "../util";

const getInvoiceToken = (invoice) =>
  get(["censorshiprecord", "token"], invoice);

export const onReceivePayApprovedInvoices = (state, action) => {
  state = receive("payApproved", state, action);
  if (action.error) return state;
  state = reset("payouts", state);
  return state;
};

export const onReceiveSetStatusInvoice = (state, action) => {
  state = receive("setStatusInvoice", state, action);
  if (action.error) return state;

  const invoiceFromState = get(["invoice", "response", "invoice"], state);

  const updatedInvoiceToken = get(
    ["setStatusInvoice", "payload", "token"],
    state
  );
  const updatedInvoiceStatus = get(["payload", "invoice", "status"], action);

  const updateInvoiceStatus = (invoice) =>
    updatedInvoiceToken === getInvoiceToken(invoice)
      ? cloneDeep({ ...invoice, status: updatedInvoiceStatus })
      : invoice;

  // update user invoices list
  const userInvoices =
    get(["userInvoices", "response", "invoices"], state) || [];
  const updatedUserInvoices = map(updateInvoiceStatus, userInvoices);

  // update admin invoices list
  const adminInvoices =
    get(["adminInvoices", "response", "invoices"], state) || [];
  const updatedAdminInvoices = map(updateInvoiceStatus, adminInvoices);

  return {
    ...state,
    userInvoices: {
      ...state.userInvoices,
      response: {
        ...state.userInvoices.resopnse,
        invoices: updatedUserInvoices
      }
    },
    adminInvoices: {
      ...state.adminInvoices,
      response: {
        ...state.adminInvoices.response,
        invoices: updatedAdminInvoices
      }
    },
    invoice: {
      ...state.invoice,
      response: {
        ...state.invoice.response,
        invoice: cloneDeep({
          ...invoiceFromState,
          status: updatedInvoiceStatus
        })
      }
    }
  };
};

export const onReceiveNewInvoiceComment = (state, action) => {
  state = receive("newComment", state, action);
  if (action.error) return state;
  return {
    ...state,
    invoiceComments: {
      ...state.invoiceComments,
      response: {
        ...state.invoiceComments.response,
        comments: [
          ...state.invoiceComments.response.comments,
          {
            ...state.newComment.payload,
            token: state.invoice.poyload,
            userid: state.newComment.response.userid,
            username: state.me.response.username,
            isadmin: state.me.response.isadmin,
            totalvotes: 0,
            resultvotes: 0,
            commentid: state.newComment.response.commentid,
            timestamp: Date.now() / 1000
          }
        ]
      }
    }
  };
};

export const onReceiveCensorInvoiceComment = (state, action) => {
  state = receive("censorComment", state, action);
  if (action.error) return state;
  return {
    ...state,
    invoiceComments: {
      ...state.invoiceComments,
      response: {
        ...state.invoiceComments.response,
        comments: state.invoiceComments.response.comments.map((c) => {
          return c.commentid === action.payload
            ? { ...c, comment: "", censored: true }
            : c;
        })
      }
    }
  };
};

export const onReceiveManageCmsUser = (state, action) => {
  state = receive("manageCmsUser", state, action);
  if (action.error) return state;
  return {
    ...state,
    user: {
      ...state.user,
      response: {
        ...state.user.response,
        user: {
          ...state.user.response.user,
          domain: action.payload.domain,
          contractortype: action.payload.contractortype,
          supervisoruserids: action.payload.supervisoruserids
        }
      }
    }
  };
};

export const onReceiveDCCs = (state, action) => {
  const oldState = { ...state };
  state = receive("dccs", state, action);
  if (action.error) return state;
  const hasPreviouslyFetchedDCCs =
    oldState.dccs &&
    oldState.dccs.response &&
    oldState.dccs.response.dccsByStatus;
  const fetchedDCCs = hasPreviouslyFetchedDCCs
    ? { ...oldState.dccs.response.dccsByStatus }
    : {};
  const newDCCList = {
    [action.payload.status]: action.payload.dccs
  };
  const x = {
    ...state,
    dccs: {
      ...state.dccs,
      response: {
        dccsByStatus: {
          ...fetchedDCCs,
          ...newDCCList
        }
      }
    }
  };
  return x;
};

export const onSetDCC = (state, action) => {
  state = receive("dcc", state, action);
  if (action.error) return state;
  const dcc = action.payload;
  return {
    ...state,
    dcc: {
      ...state.dcc,
      response: { dcc }
    }
  };
};

export const onReceiveSupportOpposeDCC = (state, action) => {
  state = receive("supportOpposeDCC", state, action);
  if (action.error) return state;
  const { supportuserids, againstuserids } = state.dcc.response.dcc;
  if (action.payload.isSupport) {
    supportuserids.push(state.me.response.userid);
  } else {
    againstuserids.push(state.me.response.userid);
  }
  return {
    ...state,
    dcc: {
      ...state.dcc,
      response: {
        ...state.dcc.response,
        dcc: {
          ...state.dcc.response.dcc,
          supportuserids,
          againstuserids
        }
      }
    }
  };
};

export const onReceiveSetDCCStatus = (state, action) => {
  state = receive("setDccStatus", state, action);
  if (action.error) return state;
  return {
    ...state,
    dcc: {
      ...state.dcc,
      response: {
        ...state.dcc.response,
        dcc: {
          ...state.dcc.response.dcc,
          status: action.payload.status,
          statuschangereason: action.payload.reason
        }
      }
    }
  };
};

export const onReceiveNewDCCComment = (state, action) => {
  state = receive("newComment", state, action);
  if (action.error) return state;
  return {
    ...state,
    dccComments: {
      ...state.dccComments,
      response: {
        ...state.dccComments.response,
        comments: [
          ...state.dccComments.response.comments,
          {
            ...state.newComment.payload,
            token: state.dcc.poyload,
            userid: state.newComment.response.userid,
            username: state.me.response.username,
            isadmin: state.me.response.isadmin,
            totalvotes: 0,
            resultvotes: 0,
            commentid: state.newComment.response.commentid,
            timestamp: Date.now() / 1000
          }
        ]
      }
    }
  };
};

export const onReceiveCensorDCCComment = (state, action) => {
  state = receive("censorComment", state, action);
  if (action.error) return state;
  return {
    ...state,
    dccComments: {
      ...state.dccComments,
      response: {
        ...state.dccComments.response,
        comments: state.dccComments.response.comments.map((c) => {
          return c.commentid === action.payload
            ? { ...c, comment: "", censored: true }
            : c;
        })
      }
    }
  };
};
