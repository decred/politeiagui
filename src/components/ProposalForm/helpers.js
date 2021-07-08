import {
  PROPOSAL_TYPE_REGULAR,
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_RFP_SUBMISSION
} from "src/constants";
import { formatUnixTimestampToObj } from "src/utils";

const typeLabels = {
  [PROPOSAL_TYPE_REGULAR]: "Regular proposal",
  [PROPOSAL_TYPE_RFP]: "RFP proposal",
  [PROPOSAL_TYPE_RFP_SUBMISSION]: "RFP submission"
};

const domainLabels = {
  development: "Development",
  research: "Research",
  marketing: "Marketing",
  design: "Design"
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
      label: typeLabels[value],
      value
    })
  );

export const getProposalDomainOptionsForSelect = (domains) =>
  domains.map((domain) => ({
    label: domainLabels[domain],
    value: domain
  }));
