import {
  DCC_STATUS_ACTIVE,
  DCC_STATUS_APPROVED,
  DCC_STATUS_REJECTED,
  DCC_STATUS_DRAFTS,
  DCC_TYPE_ISSUANCE,
  DCC_TYPE_REVOCATION
} from "./constants";
import isEmpty from "lodash/isEmpty";
import { CMS_USER_TYPES, CMS_DOMAINS } from "../../constants";

const dccTypes = {
  [DCC_TYPE_REVOCATION]: "Revocation",
  [DCC_TYPE_ISSUANCE]: "Issuance"
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
