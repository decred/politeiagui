import {
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_CENSORED
} from "src/constants";

export const tabValues = {
  UNREVIEWED: "Unreviewed",
  CENSORED: "Censored"
};

export const statusByTab = {
  [tabValues.UNREVIEWED]: [PROPOSAL_STATUS_UNREVIEWED],
  [tabValues.CENSORED]: [PROPOSAL_STATUS_CENSORED]
};
