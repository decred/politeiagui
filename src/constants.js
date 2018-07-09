import packageJson from "../package.json";

export const NETWORK = packageJson.network;
export const PROPOSAL_STATUS_UNREVIEWED = 2;
export const PROPOSAL_STATUS_CENSORED = 3;
export const PROPOSAL_STATUS_PUBLIC = 4;

export const PAYWALL_STATUS_WAITING = 0;
export const PAYWALL_STATUS_LACKING_CONFIRMATIONS = 1;
export const PAYWALL_STATUS_PAID = 2;

export const PUB_KEY_STATUS_LOADING = 0;
export const PUB_KEY_STATUS_LOADED = 1;

export const PROPOSAL_VOTING_NOT_STARTED = 1;
export const PROPOSAL_VOTING_ACTIVE = 2;
export const PROPOSAL_VOTING_FINISHED = 3;

export const LIST_HEADER_PUBLIC = "Public Proposals";
export const LIST_HEADER_UNVETTED = "Unvetted Proposals";
