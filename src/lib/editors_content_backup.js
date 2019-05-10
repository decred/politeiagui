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

export const INVOICE_FORM_NAME = "name";

export const getInvoiceBackupKey = (key, path) => `invoice-${key}::${path}`;

const updateInvoiceFormData = state => {
  const invoiceFormState = state.form["form/record"];
  const newInvoiceData = (invoiceFormState && invoiceFormState.values) || {};
  const name = newInvoiceData[INVOICE_FORM_NAME];
  if (!name) {
    return;
  }

  const path = getProposalPath(window.location);
  sessionStorage.setItem(
    getInvoiceBackupKey(INVOICE_FORM_NAME, path),
    newInvoiceData[INVOICE_FORM_NAME]
  );
};

export const resetNewInvoiceData = () => {
  sessionStorage.setItem(
    getInvoiceBackupKey(INVOICE_FORM_NAME, NEW_INVOICE_PATH),
    ""
  );
};

export const getNewInvoiceData = () => {
  return {
    name:
      sessionStorage.getItem(
        getInvoiceBackupKey(INVOICE_FORM_NAME, NEW_INVOICE_PATH)
      ) || ""
  };
};

export const handleSaveCSVEditorsContent = state => {
  updateInvoiceFormData(state);
};
