import {
  PROPOSAL_TYPE_REGULAR,
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_RFP_SUBMISSION
} from "src/constants";
import { formatUnixTimestampToObj } from "src/utils";

const typesLabels = {
  [PROPOSAL_TYPE_REGULAR]: "Regular proposal",
  [PROPOSAL_TYPE_RFP]: "RFP proposal",
  [PROPOSAL_TYPE_RFP_SUBMISSION]: "RFP submission"
};

/**
 * Returns the available dates range as objects { min,max } for RFP linkby
 * using policy[ticketvote] provided values
 * @param {number} linkbyperiodmin min possible linkby period as seconds unix
 * @param {number} linkbyperiodmax max possible linkby period as seconds unix
 */
export const getRfpMinMaxDates = (linkbyperiodmin, linkbyperiodmax) => {
  const currentTimeSec = new Date().getTime() / 1000;
  return {
    min: formatUnixTimestampToObj(currentTimeSec + Number(linkbyperiodmin)),
    max: formatUnixTimestampToObj(currentTimeSec + Number(linkbyperiodmax))
  };
};

/**
 * Returns the proposal type select options.
 * @returns {Array} sortSelectOptions
 */
export const getProposalTypeOptionsForSelect = () =>
  [PROPOSAL_TYPE_REGULAR, PROPOSAL_TYPE_RFP, PROPOSAL_TYPE_RFP_SUBMISSION].map(
    (value) => ({
      label: typesLabels[value],
      value
    })
  );

/**
 * Returns the deadline timestamp from given date
 * @param {Object} date
 */
export const getRfpDeadlineTimestamp = (rfpDeadline) => {
  if (!rfpDeadline) return 0;
  const now = new Date();
  const deadline = new Date(
    rfpDeadline.year,
    rfpDeadline.month - 1,
    rfpDeadline.day,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  );
  return deadline.getTime() / 1000;
};
