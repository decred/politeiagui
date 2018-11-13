export const MAINNET = "mainnet";
export const TESTNET = "testnet";

export const EXPLORER = "explorer";

export const PROPOSAL_FILTER_ALL = 0;

export const PROPOSAL_STATUS_UNREVIEWED = 2;
export const PROPOSAL_STATUS_CENSORED = 3;
export const PROPOSAL_STATUS_PUBLIC = 4;
export const PROPOSAL_STATUS_UNREVIEWED_CHANGES = 5;

export const PROPOSAL_USER_FILTER_SUBMITTED = 1;
export const PROPOSAL_USER_FILTER_DRAFT = 2;

export const PAYWALL_STATUS_WAITING = 0;
export const PAYWALL_STATUS_LACKING_CONFIRMATIONS = 1;
export const PAYWALL_STATUS_PAID = 2;
export const CONFIRMATIONS_REQUIRED = 2;

export const PUB_KEY_STATUS_LOADING = 0;
export const PUB_KEY_STATUS_LOADED = 1;

export const PROPOSAL_VOTING_NOT_AUTHORIZED = 1;
export const PROPOSAL_VOTING_AUTHORIZED = 2;
export const PROPOSAL_VOTING_ACTIVE = 3;
export const PROPOSAL_VOTING_FINISHED = 4;

export const USER_DETAIL_TAB_GENERAL = 0;
export const USER_DETAIL_TAB_PREFERENCES = 1;
export const USER_DETAIL_TAB_PROPOSALS = 2;
export const USER_DETAIL_TAB_COMMENTS = 3;

export const MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION = 1;
export const MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION = 2;
export const MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION = 3;
export const MANAGE_USER_CLEAR_USER_PAYWALL = 4;
export const MANAGE_USER_UNLOCK = 5;
export const MANAGE_USER_DEACTIVATE = 6;
export const MANAGE_USER_REACTIVATE = 7;

export const LIST_HEADER_PUBLIC = "Public Proposals";
export const LIST_HEADER_UNVETTED = "Unvetted Proposals";
export const LIST_HEADER_USER = "Your Proposals";

export const SORT_BY_OLD = "OLD";
export const SORT_BY_NEW = "NEW";
export const SORT_BY_TOP = "TOP";

export const DEFAULT_TAB_TITLE = "Politeia";

export const NOTIFICATION_EMAIL_MY_PROPOSAL_STATUS_CHANGE = 1 << 0;
export const NOTIFICATION_EMAIL_MY_PROPOSAL_VOTE_STARTED = 1 << 1;

export const NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VETTED = 1 << 10;
export const NOTIFICATION_EMAIL_REGULAR_PROPOSAL_EDITED = 1 << 11;
export const NOTIFICATION_EMAIL_REGULAR_PROPOSAL_VOTE_STARTED = 1 << 12;

export const NOTIFICATION_EMAIL_ADMIN_PROPOSAL_NEW = 1 << 20;
export const NOTIFICATION_EMAIL_ADMIN_PROPOSAL_VOTE_AUTHORIZED = 1 << 21;
