import {
  DCC_STATUS_ACTIVE,
  DCC_STATUS_APPROVED,
  DCC_STATUS_REJECTED,
  DCC_STATUS_DRAFTS,
  DCC_TYPE_ISSUANCE,
  DCC_TYPE_REVOCATION,
  DCC_DOMAIN_INVALID,
  CONTRACTOR_TYPE_NOMINEE,
  CONTRACTOR_TYPE_REVOKED,
  CONTRACTOR_TYPE_SUPERVISOR
} from "./constants";
import isEmpty from "lodash/isEmpty";
import some from "lodash/fp/some";
import isEqual from "lodash/fp/isEqual";
import { or } from "src/lib/fp";
import { CMS_USER_TYPES, CMS_DOMAINS } from "../../constants";

const dccTypes = {
  [DCC_TYPE_REVOCATION]: "Revocation",
  [DCC_TYPE_ISSUANCE]: "Issuance"
};

const dccStatusList = {
  [DCC_STATUS_ACTIVE]: "active",
  [DCC_STATUS_APPROVED]: "approved",
  [DCC_STATUS_REJECTED]: "rejected"
};

/**
 * Returns the corresponding type's name
 * @param {Number} type
 */
export const presentationalDccType = (dcc) =>
  dcc && dcc.dccpayload && dccTypes[dcc.dccpayload.type];

/**
 * Returns the corresponding StatusTag props for given DCC object
 * @param {Object} dcc
 */
export const getDccStatusTagProps = (dcc) => {
  switch (dcc.status) {
    case DCC_STATUS_ACTIVE:
      return {
        type: "yellowTime",
        text: "Active"
      };
    case DCC_STATUS_APPROVED:
      return {
        type: "greenCheck",
        text: "Approved"
      };
    case DCC_STATUS_REJECTED:
      return {
        type: "orangeNegativeCircled",
        text: "Rejected"
      };
    case DCC_STATUS_DRAFTS:
      return {
        type: "blackTime",
        text: "Draft"
      };
    default:
      break;
  }
};

/**
 * Returns a presentational name for a given DCC based on the nominee
 * username, and dcc type
 * @param {Object} dcc
 */
export const presentationalDccName = (dcc) =>
  dcc && dcc.dccpayload
    ? `${presentationalDccType(dcc)} for ${dcc.nomineeusername}`
    : "";

/**
 * Returns a presentational name for a draft dcc
 * @param {Object} dcc
 */
export const presentationalDraftDccName = (draft) =>
  draft && draft.type && draft.nomineeUsername
    ? `${dccTypes[draft.type]} DCC draft for ${draft.nomineeUsername}`
    : "";

/**
 * Returns a presentational name for DCC Contractor Types
 * @param {Number} type
 */
export const presentationalDccContractorType = (type) => CMS_USER_TYPES[type];

/**
 * Returns a presentational Domain name
 * @param {Number} domain
 */
export const presentationalDccDomain = (domain) => CMS_DOMAINS[domain];

/**
 * Returns statement if it exists, otherwise returns a message indicating that
 * dcc is empty
 * @param {String} domain
 */
export const presentationalStatement = (statement) =>
  isEmpty(statement) ? "No statement provided" : statement;

/**
 * Returns a presentational dcc status
 * @param {Object} dcc
 */
export const presentationalStatus = (status) => dccStatusList[status];

/**
 * Returns if dcc is revocation
 * @param {Object} dcc
 */
export const isRevocationDcc = (dcc) =>
  dcc && dcc.dccpayload && dcc.dccpayload.type === DCC_TYPE_REVOCATION;

/**
 * Returns if dcc's status is active
 * @param {Object} dcc
 */
export const isDccActive = (dcc) => dcc && dcc.status === DCC_STATUS_ACTIVE;

/**
 * Returns if dcc's status is approved
 * @param {Object} dcc
 */
export const isDccApproved = (dcc) => dcc && dcc.status === DCC_STATUS_APPROVED;

/**
 * Returns domain options for selectors
 */
export const getDomainOptions = () =>
  CMS_DOMAINS.map((label, value) => ({ label, value }));

/**
 * Returns contractor type options for selectors
 */
export const getContractorTypeOptions = () =>
  CMS_USER_TYPES.reduce(
    (acc, label, value) =>
      value === CONTRACTOR_TYPE_NOMINEE ||
      value === CONTRACTOR_TYPE_REVOKED ||
      value === CONTRACTOR_TYPE_SUPERVISOR
        ? [...acc]
        : [...acc, { label, value }],
    []
  );

/**
 * Retuns DCC type options for selectors
 */
export const getDccTypeOptions = () => [
  {
    label: dccTypes[DCC_TYPE_ISSUANCE],
    value: DCC_TYPE_ISSUANCE
  },
  {
    label: dccTypes[DCC_TYPE_REVOCATION],
    value: DCC_TYPE_REVOCATION
  }
];

/**
 * Returns user options for DCC from user object list
 * @param {Array} users
 */
export const getNomineeOptions = (users) =>
  users.map(({ username, id }) => ({ label: username, value: id }));
/**
 * Return if dcc's status is not active using fp approach
 * @param {Object} dcc
 */
export const isDccNotActiveFP = (dcc) => () => !isDccActive(dcc);

/**
 * Returns a status list for StatusBar component
 * @param {Array} supportuserids
 * @param {Array} againstuserids
 */
export const dccSupportOpposeStatus = (supportuserids, againstuserids) => [
  {
    label: "Support",
    amount: supportuserids.length,
    color: "green"
  },
  {
    label: "Against",
    amount: againstuserids.length,
    color: "orange"
  }
];

/**
 * Returns an object list with shape { label: username, value: id }
 * from 2 arrays of the same size
 * @param {Array} idList List of ids
 * @param {Array} usernameList List of usernames
 */
export const dccSupportOpposeList = (idList, usernameList) =>
  idList.map((id, index) => ({ label: usernameList[index], value: id }));

/**
 * Returns if userid is on idArray using fp approach
 * @param {Array} idArray
 * @param {String} userid
 */
export const isUserIdOn = (idArray) => (userid) =>
  some((id) => id === userid)(idArray);

/**
 * Returns if dcc support/oppose action is available
 * @param {String} userid
 * @param {Object} dcc
 */
export const isDccSupportOpposeAvailable = (userid, dcc) =>
  !or(
    isUserIdOn(dcc.supportuserids),
    isUserIdOn(dcc.againstuserids),
    isEqual(dcc.sponsoruserid),
    isDccNotActiveFP(dcc)
  )(userid);

/**
 * Returns if cms user is a valid contractor
 * @param {Number} contractortype
 * @param {Number} domain
 */
export const isUserValidContractor = (user) =>
  user &&
  user.domain !== DCC_DOMAIN_INVALID &&
  user.contractortype !== CONTRACTOR_TYPE_REVOKED &&
  user.contractortype !== CONTRACTOR_TYPE_NOMINEE;
