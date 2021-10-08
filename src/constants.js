export const MAINNET = "mainnet";
export const TESTNET = "testnet";

export const CMSWWWMODE = "cmswww";

export const RECORD_TYPE_PROPOSAL = "proposals";
export const RECORD_TYPE_INVOICE = "invoices";

export const EXPLORER = "dcrdata";

export const CENSORSHIP_TOKEN_LENGTH = 16;

// DCC
export const DCC_STATUS_ACTIVE = 1;
export const DCC_STATUS_APPROVED = 2;
export const DCC_STATUS_REJECTED = 3;
export const DCC_STATUS_DRAFTS = 4;

export const DCC_TYPE_ISSUANCE = 1;
export const DCC_TYPE_REVOCATION = 2;

export const DCC_DIRECT_CONTRACTOR_TYPE = 1;
export const DCC_SUB_CONTRACTOR_TYPE = 3;

export const DCC_SUPPORT_VOTE = "aye";
export const DCC_OPPOSE_VOTE = "nay";

// CMS
export const INVOICE_STATUS_UNREVIEWED = 2;
export const INITIAL_YEAR = 2018;

// POLITEIA

export const PROPOSAL_FILTER_ALL = 0;

export const PROPOSAL_STATUS_UNREVIEWED = 1;
export const PROPOSAL_STATUS_PUBLIC = 2;
export const PROPOSAL_STATUS_CENSORED = 3;
export const PROPOSAL_STATUS_ARCHIVED = 4;

export const PROPOSAL_SUMMARY_STATUS_UNVETTED = "unvetted";
export const PROPOSAL_SUMMARY_STATUS_UNVETTED_ABANDONED = "unvetted-abandoned";
export const PROPOSAL_SUMMARY_STATUS_UNVETTED_CENSORED = "unvetted-censored";
export const PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW = "under-review";
export const PROPOSAL_SUMMARY_STATUS_ABANDONED = "abandoned";
export const PROPOSAL_SUMMARY_STATUS_CENSORED = "censored";
export const PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED = "vote-authorized";
export const PROPOSAL_SUMMARY_STATUS_VOTE_STARTED = "vote-started";
export const PROPOSAL_SUMMARY_STATUS_REJECTED = "rejected";
export const PROPOSAL_SUMMARY_STATUS_ACTIVE = "active";
export const PROPOSAL_SUMMARY_STATUS_COMPLETED = "completed";
export const PROPOSAL_SUMMARY_STATUS_CLOSED = "closed";

export const PROPOSAL_STATE_UNVETTED = 1;
export const PROPOSAL_STATE_VETTED = 2;

export const PROPOSAL_TYPE_REGULAR = 1;
export const PROPOSAL_TYPE_RFP = 2;
export const PROPOSAL_TYPE_RFP_SUBMISSION = 3;

export const PROPOSAL_BILLING_STATUS_ACTIVE = 1;
export const PROPOSAL_BILLING_STATUS_CLOSED = 2;
export const PROPOSAL_BILLING_STATUS_COMPLETED = 3;

export const VOTE_TYPE_STANDARD = 1;
export const VOTE_TYPE_RUNOFF = 2;

export const PROPOSAL_USER_FILTER_SUBMITTED = 1;
export const PROPOSAL_USER_FILTER_DRAFT_PROPOSALS = 2;

export const PROPOSAL_METADATA_FILENAME = "proposalmetadata.json";
export const VOTE_METADATA_FILENAME = "votemetadata.json";
export const PROPOSAL_UPDATE_HINT = "proposalupdate";

export const PROPOSAL_AMOUNT_UNIT = "$";

export const PROPOSAL_MAIN_THREAD_KEY = "main";

export const USER_METADATA_PLUGIN = "usermd";

export const PAYWALL_STATUS_WAITING = 0;
export const PAYWALL_STATUS_LACKING_CONFIRMATIONS = 1;
export const PAYWALL_STATUS_PAID = 2;

export const CMS_PAYWALL_STATUS = 2;
export const CONFIRMATIONS_REQUIRED = 2;

export const PUB_KEY_STATUS_LOADING = 0;
export const PUB_KEY_STATUS_LOADED = 1;

export const PROPOSAL_VOTING_NOT_AUTHORIZED = 1;
export const PROPOSAL_VOTING_AUTHORIZED = 2;
export const PROPOSAL_VOTING_ACTIVE = 3;
export const PROPOSAL_VOTING_FINISHED = 4;
export const PROPOSAL_VOTING_APPROVED = 5;
export const PROPOSAL_VOTING_REJECTED = 6;
export const PROPOSAL_VOTING_INELIGIBLE = 7;
export const PROPOSAL_APPROVED = 8;

export const PROPOSAL_COMMENT_UPVOTE = 1;
export const PROPOSAL_COMMENT_DOWNVOTE = -1;

export const PROPOSAL_PAGE_SIZE = 5;
export const INVENTORY_PAGE_SIZE = 20;

// Proposals presentational statuses returned by the 'voteinv' &
// 'proposalinv' endpoints from the API.
export const UNREVIEWED = "unreviewed";
export const VETTEDCENSORED = "vettedcensored";
export const UNVETTEDCENSORED = "unvettedcensored";
export const ABANDONED = "abandoned";
export const PRE_VOTE = "pre";
export const ACTIVE_VOTE = "started";
export const APPROVED = "approved";
export const AUTHORIZED = "authorized";
export const UNAUTHORIZED = "unauthorized";
export const REJECTED = "rejected";
export const INELIGIBLE = "ineligible";
export const ARCHIVED = "archived";
export const PUBLIC = "public";
export const CENSORED = "censored";
export const VETTED = "vetted";
export const UNVETTED = "unvetted";

export const USER_DETAIL_TAB_GENERAL = 0;
export const USER_DETAIL_TAB_PREFERENCES = 1;
export const USER_DETAIL_TAB_PROPOSALS = 2;
export const USER_DETAIL_TAB_COMMENTS = 3;
export const USER_DETAIL_TAB_INVOICES = 4;
export const USER_DETAIL_TAB_MANAGE_USER = 5;

export const MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION = 1;
export const MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION = 2;
export const MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION = 3;
export const MANAGE_USER_CLEAR_USER_PAYWALL = 4;
export const MANAGE_USER_UNLOCK = 5;
export const MANAGE_USER_DEACTIVATE = 6;
export const MANAGE_USER_REACTIVATE = 7;
export const LIST_HEADER_VETTED = "Proposals";
export const LIST_HEADER_ADMIN = "Admin Proposals";
export const LIST_HEADER_USER = "Your Proposals";
export const SORT_BY_OLD = "OLD";
export const SORT_BY_NEW = "NEW";
export const SORT_BY_TOP = "TOP";

export const DEFAULT_TAB_TITLE = "Politeia";

export const NOTIFICATION_EMAIL_MY_PROPOSAL_STATUS_CHANGE = 1 << 0;
export const NOTIFICATION_EMAIL_MY_PROPOSAL_VOTE_STARTED = 1 << 1;
export const NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VETTED = 1 << 2;
export const NOTIFICATION_EMAIL_REGULAR_PROPOSAL_EDITED = 1 << 3;
export const NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VOTE_STARTED = 1 << 4;
export const NOTIFICATION_EMAIL_ADMIN_PROPOSAL_NEW = 1 << 5;
export const NOTIFICATION_EMAIL_ADMIN_PROPOSAL_VOTE_AUTHORIZED = 1 << 6;
export const NOTIFICATION_EMAIL_COMMENT_ON_MY_PROPOSAL = 1 << 7;
export const NOTIFICATION_EMAIL_COMMENT_ON_MY_COMMENT = 1 << 8;
// Import key errors
export const PUBLIC_KEY_MISMATCH =
  "The provided public key doesn't match the key stored in the server.";
export const INVALID_KEY_PAIR = "The provided key pair is not valid.";
export const INVALID_FILE =
  "This is not a valid identity file. The identity has to be a JSON file containing the publicKey and the secretKey values.";
export const LOAD_KEY_FAILED =
  "Sorry, something went wrong while importing the identity file, please try again. If the error persists, contact the Politeia support.";

//Links
export const PI_DOCS = "https://docs.decred.org/governance/politeia/politeia/";
export const PROPOSAL_GUIDELINES =
  "https://docs.decred.org/governance/politeia/proposal-guidelines/";

export const INVOICE_STATUS_INVALID = 0; // Invalid status XXX?
export const INVOICE_STATUS_NOTFOUND = 1; // Invoice not found XXX?

export const INVOICE_STATUS_NEW = 2; // Invoice has not been reviewed
export const INVOICE_STATUS_UPDATED = 3; // Invoice has unreviewed changes
export const INVOICE_STATUS_DISPUTED = 4; // Invoice has been disputed for some reason
export const INVOICE_STATUS_REJECTED = 5; // Invoice needs to be revised
export const INVOICE_STATUS_APPROVED = 6; // Invoice has been approved
export const INVOICE_STATUS_PAID = 7; // Invoice has been paid

export const INVOICE_FILTER_ALL = 99;
export const PROPOSAL_USER_FILTER_DRAFT_INVOICES = 100;

export const CMS_LIST_HEADER_ADMIN = "Admin Invoices";
export const CMS_LIST_HEADER_USER = "Your Invoices";

export const CMS_DEFAULT_TAB_TITLE = "Contractor Management System";

export const FILTER_ALL_MONTHS = 0;

export const BLOCK_DURATION_TESTNET = 2;
export const BLOCK_DURATION_MAINNET = 5;

export const CMS_USER_TYPES = [
  "No type defined",
  "Direct",
  "Supervisor",
  "Sub Contractor",
  "Nominee",
  "Revoked"
];

export const NOJS_ROUTE_PREFIX = "/nojavascript";

export const MONTHS_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export const TOTP_CODE_LENGTH = 6;
export const TOTP_DEFAULT_TYPE = 1;
export const TOTP_MISSING_LOGIN_ERROR = 79;

// TODO: remove legacy
export const ARCHIVE_URL = "https://proposals-archive.decred.org/";
