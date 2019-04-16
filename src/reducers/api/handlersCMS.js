import cloneDeep from "lodash/cloneDeep";
import get from "lodash/fp/get";
import map from "lodash/fp/map";
import { receive } from "../util";

const getInvoiceToken = invoice => get(["censorshiprecord", "token"], invoice);

export const onReceiveSetStatusInvoice = (state, action) => {
  state = receive("setStatusInvoice", state, action);
  if (action.error) return state;

  const invoiceFromState = get(["invoice", "response", "invoice"], state);

  const updatedInvoiceToken = get(
    ["setStatusInvoice", "payload", "token"],
    state
  );
  const updatedInvoiceStatus = get(["payload", "invoice", "status"], action);

  const updateInvoiceStatus = invoice =>
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
        comments: state.invoiceComments.response.comments.map(c => {
          return c.commentid === action.payload
            ? { ...c, comment: "", censored: true }
            : c;
        })
      }
    }
  };
};
