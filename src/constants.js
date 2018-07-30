import packageJson from "../package.json";

export const NETWORK = packageJson.network;

export const PROPOSAL_FILTER_ALL = 0;

export const PROPOSAL_STATUS_UNREVIEWED = 2;
export const PROPOSAL_STATUS_CENSORED = 3;
export const PROPOSAL_STATUS_PUBLIC = 4;

export const PROPOSAL_USER_FILTER_SUBMITTED = 1;
export const PROPOSAL_USER_FILTER_DRAFT = 2;

export const PAYWALL_STATUS_WAITING = 0;
export const PAYWALL_STATUS_LACKING_CONFIRMATIONS = 1;
export const PAYWALL_STATUS_PAID = 2;

export const PUB_KEY_STATUS_LOADING = 0;
export const PUB_KEY_STATUS_LOADED = 1;

export const PROPOSAL_VOTING_NOT_STARTED = 1;
export const PROPOSAL_VOTING_ACTIVE = 2;
export const PROPOSAL_VOTING_FINISHED = 3;

export const USER_DETAIL_TAB_GENERAL = 0;
export const USER_DETAIL_TAB_PROPOSALS = 1;
export const USER_DETAIL_TAB_COMMENTS = 2;

export const EDIT_USER_EXPIRE_NEW_USER_VERIFICATION = 1;
export const EDIT_USER_EXPIRE_UPDATE_KEY_VERIFICATION = 2;
export const EDIT_USER_EXPIRE_RESET_PASSWORD_VERIFICATION = 3;
export const EDIT_USER_CLEAR_USER_PAYWALL = 4;
export const EDIT_USER_UNLOCK = 5;

export const LIST_HEADER_PUBLIC = "Public Proposals";
export const LIST_HEADER_UNVETTED = "Unvetted Proposals";
export const LIST_HEADER_USER = "Your Proposals";

export const SORT_BY_OLD = "OLD";
export const SORT_BY_NEW = "NEW";
export const SORT_BY_TOP = "TOP";
