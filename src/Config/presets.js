export const constants = {
  RECORD_TYPE_INVOICE: "invoice",
  RECORD_TYPE_PROPOSAL: "proposal"
};

export const commonDefaults = {
  isStaging: false
};

export const POLITEIA = {
  ...commonDefaults,
  title: "Politeia",
  recordType: constants.RECORD_TYPE_PROPOSAL,
  enableAdminInvite: false
};

export const CMS = {
  ...commonDefaults,
  title: "Contractor Management",
  recordType: constants.RECORD_TYPE_INVOICE,
  enableAdminInvite: true
};
