export const constants = {
  RECORD_TYPE_INVOICE: "invoice",
  RECORD_TYPE_PROPOSAL: "proposal"
};

export const commonDefaults = {
  isStaging: false,
  aboutContent: "about-politeia"
};

export const POLITEIA = {
  ...commonDefaults,
  title: "Politeia",
  recordType: constants.RECORD_TYPE_PROPOSAL,
  enableAdminInvite: false,
  privacyPolicyContent: "privacy-policy"
};

export const CMS = {
  ...commonDefaults,
  title: "Contractor Management",
  recordType: constants.RECORD_TYPE_INVOICE,
  enableAdminInvite: true,
  privacyprivacyPolicyContent: "privacy-policy-cms"
};
