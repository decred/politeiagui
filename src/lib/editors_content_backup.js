/*
This lib is designed to handle persisting data for the text editors using session storage
*/
import qs from "query-string";

export const NEW_PROPOSAL_PATH = "/proposals/new";

export const getProposalPath = location => {
  const { pathname, search } = location;
  const { draftid } = qs.parse(search);
  const path = draftid ? `${pathname}-${draftid}` : pathname;
  return path;
};

export const PROPOSAL_FORM_NAME = "name";
export const PROPOSAL_FORM_DESC = "description";

export const getProposalBackupKey = (key, path) => `proposal-${key}::${path}`;

const updateProposalFormData = state => {
  const proposalFormState = state.form["form/record"];
  const newProposalData = (proposalFormState && proposalFormState.values) || {};
  const name = newProposalData[PROPOSAL_FORM_NAME];
  const description = newProposalData[PROPOSAL_FORM_DESC];
  if (!name && !description) {
    return;
  }

  const path = getProposalPath(window.location);
  sessionStorage.setItem(
    getProposalBackupKey(PROPOSAL_FORM_NAME, path),
    newProposalData[PROPOSAL_FORM_NAME]
  );
  sessionStorage.setItem(
    getProposalBackupKey(PROPOSAL_FORM_DESC, path),
    newProposalData[PROPOSAL_FORM_DESC]
  );
};

export const resetNewProposalData = () => {
  sessionStorage.setItem(
    getProposalBackupKey(PROPOSAL_FORM_NAME, NEW_PROPOSAL_PATH),
    ""
  );
  sessionStorage.setItem(
    getProposalBackupKey(PROPOSAL_FORM_DESC, NEW_PROPOSAL_PATH),
    ""
  );
};

export const getNewProposalData = () => {
  return {
    name:
      sessionStorage.getItem(
        getProposalBackupKey(PROPOSAL_FORM_NAME, NEW_PROPOSAL_PATH)
      ) || "",
    description:
      sessionStorage.getItem(
        getProposalBackupKey(PROPOSAL_FORM_DESC, NEW_PROPOSAL_PATH)
      ) || ""
  };
};

export const handleSaveTextEditorsContent = state => {
  updateProposalFormData(state);
};

//CMS
export const NEW_INVOICE_PATH = "/invoices/new";

export const getInvoicePath = location => {
  const { pathname, search } = location;
  const { draftid } = qs.parse(search);
  const path = draftid ? `${pathname}-${draftid}` : pathname;
  return path;
};

export const INVOICE_FORM_ADDRESS = "address";
export const INVOICE_FORM_CONTACT = "contact";
export const INVOICE_FORM_LINE_ITEMS = "lineitems";
export const INVOICE_FORM_LOCATION = "location";
export const INVOICE_FORM_MONTH = "month";
export const INVOICE_FORM_YEAR = "year";
export const INVOICE_FORM_NAME = "name";
export const INVOICE_FORM_RATE = "rate";

export const getInvoiceBackupKey = (key, path) => `invoice-${key}::${path}`;

const updateInvoiceFormData = state => {
  const invoiceFormState = state.form["form/record"];
  const newInvoiceData = (invoiceFormState && invoiceFormState.values) || {};

  const address = newInvoiceData[INVOICE_FORM_ADDRESS];
  const contact = newInvoiceData[INVOICE_FORM_CONTACT];
  const lineItems = newInvoiceData[INVOICE_FORM_LINE_ITEMS];
  const location = newInvoiceData[INVOICE_FORM_LOCATION];
  const month = newInvoiceData[INVOICE_FORM_MONTH];
  const year = newInvoiceData[INVOICE_FORM_YEAR];
  const name = newInvoiceData[INVOICE_FORM_NAME];
  const rate = newInvoiceData[INVOICE_FORM_RATE];

  if (
    !address &&
    !contact &&
    !lineItems &&
    !location &&
    !month &&
    !year &&
    !name &&
    !rate
  ) {
    return;
  }

  const path = getProposalPath(window.location);
  sessionStorage.setItem(
    getInvoiceBackupKey(INVOICE_FORM_ADDRESS, path),
    newInvoiceData[INVOICE_FORM_ADDRESS]
  );
};

export const resetNewInvoiceData = () => {
  sessionStorage.setItem(
    getInvoiceBackupKey(INVOICE_FORM_ADDRESS, NEW_INVOICE_PATH),
    ""
  );
};

export const getNewInvoiceData = () => {
  return {
    name:
      sessionStorage.getItem(
        getInvoiceBackupKey(INVOICE_FORM_ADDRESS, NEW_INVOICE_PATH)
      ) || ""
  };
};

export const handleSaveCSVEditorsContent = state => {
  updateInvoiceFormData(state);
};
