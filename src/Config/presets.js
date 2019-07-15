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
  paywallContent: "paywall-politeia",
  recordType: constants.RECORD_TYPE_PROPOSAL,
  enableAdminInvite: false,
  enableCommentVote: true,
  enablePaywall: true,
  privacyPolicyContent: "privacy-policy",
  testnetGitRepository:
    "https://github.com/decred-proposals/testnet3/tree/master",
  mainnetGitRepository:
    "https://github.com/decred-proposals/mainnet/tree/master"
};

export const CMS = {
  ...commonDefaults,
  title: "Contractor Management",
  recordType: constants.RECORD_TYPE_INVOICE,
  enableAdminInvite: true,
  enableCommentVote: false,
  enablePaywall: false,
  privacyprivacyPolicyContent: "privacy-policy-cms",
  testnetGitRepository: "",
  mainnetGitRepository: ""
};
