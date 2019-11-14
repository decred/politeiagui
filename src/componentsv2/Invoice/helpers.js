import {
  INVOICE_STATUS_NEW,
  INVOICE_STATUS_UPDATED,
  INVOICE_STATUS_DISPUTED,
  INVOICE_STATUS_REJECTED,
  INVOICE_STATUS_APPROVED,
  INVOICE_STATUS_PAID
} from "src/containers/Invoice";

export const getInvoiceStatusTagProps = invoice => {
  switch (invoice.status) {
    case INVOICE_STATUS_NEW:
    case INVOICE_STATUS_UPDATED:
      return {
        type: "blackTime",
        text: "Waiting for review"
      };
    case INVOICE_STATUS_DISPUTED:
      return { type: "bluePending", text: "On dispute" };
    case INVOICE_STATUS_REJECTED:
      return { type: "grayNegative", text: "Rejected" };
    case INVOICE_STATUS_APPROVED:
      return { type: "yellowTime", text: "Waiting payment" };
    case INVOICE_STATUS_PAID:
      return { type: "greenCheck", text: "Paid" };
    default:
      break;
  }
};
