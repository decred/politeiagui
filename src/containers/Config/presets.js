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
  logoAsset: "pi-logo-light.svg",
  paywallContent: "paywall-politeia",
  recordType: constants.RECORD_TYPE_PROPOSAL,
  enableAdminInvite: false,
  enableCommentVote: true,
  enableCredits: true,
  enablePaywall: true,
  privacyPolicyContent: "privacy-policy",
  testnetGitRepository:
    "https://github.com/decred-proposals/testnet3/tree/master",
  mainnetGitRepository:
    "https://github.com/decred-proposals/mainnet/tree/master",
  navMenuPaths: [
    { label: "Proposals", path: "/", admin: false },
    { label: "Admin", path: "/proposals/unvetted", admin: true },
    { label: "Search for users", path: "/user/search", admiin: true }
  ]
};

export const CMS = {
  ...commonDefaults,
  title: "Contractor Management",
  logoAsset: "cms-logo-light.svg",
  recordType: constants.RECORD_TYPE_INVOICE,
  enableAdminInvite: true,
  enableCommentVote: false,
  enableCredits: false,
  enablePaywall: false,
  privacyPolicyContent: "privacy-policy-cms",
  testnetGitRepository: "",
  mainnetGitRepository: "",
  navMenuPaths: [
    { label: "My invoices", path: "/invoices/me", admin: false },
    { label: "Admin", path: "/invoices/admin", admin: true },
    { label: "Search for users", path: "/user/search", admiin: true }
  ]
};
