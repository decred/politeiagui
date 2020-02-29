export const DCC_STATUS_ACTIVE = 1;
export const DCC_STATUS_APPROVED = 2;
export const DCC_STATUS_REJECTED = 3;
export const DCC_STATUS_DRAFTS = 4;

export const DCC_TYPE_ISSUANCE = 1;
export const DCC_TYPE_REVOCATION = 2;

export const CONTRACTOR_TYPE_DIRECT = 1;
export const CONTRACTOR_TYPE_SUPERVISOR = 2;
export const CONTRACTOR_TYPE_SUBCONTRACTOR = 3;
export const CONTRACTOR_TYPE_NOMINEE = 4;
export const CONTRACTOR_TYPE_REVOKED = 5;

export const DCC_DOMAINS = [
  "Development",
  "Marketing",
  "Design",
  "Research",
  "Documentation",
  "Community Management"
];
export const DCC_DOMAIN_INVALID = 0;

export const DCC_FULL_USER_CONTRACTOR_TYPES = [
  CONTRACTOR_TYPE_DIRECT,
  CONTRACTOR_TYPE_SUPERVISOR,
  CONTRACTOR_TYPE_SUBCONTRACTOR
];
export const DCC_SUPPORT_ACTION = "aye";
export const DCC_OPPOSE_ACTION = "nay";
