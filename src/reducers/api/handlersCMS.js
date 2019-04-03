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
