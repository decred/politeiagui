import React from "react";
import { Tabs, Tab } from "./Tabs";
import {
  PROPOSAL_FILTER_ALL,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_USER_FILTER_SUBMITTED,
  PROPOSAL_USER_FILTER_DRAFT,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_FINISHED,
  LIST_HEADER_PUBLIC,
  LIST_HEADER_UNVETTED,
  LIST_HEADER_USER,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES,
  PROPOSAL_VOTING_AUTHORIZED
} from "../constants";

const adminFilterOptions = [
  {
    label: "unreviewed",
    value: PROPOSAL_STATUS_UNREVIEWED
  },
  {
    label: "censored",
    value: PROPOSAL_STATUS_CENSORED
  },
  {
    label: "all proposals",
    value: PROPOSAL_FILTER_ALL
  }
];
const publicFilterOptions = [
  {
    label: "pre-voting",
    value: PROPOSAL_VOTING_NOT_AUTHORIZED
  },
  {
    label: "active voting",
    value: PROPOSAL_VOTING_ACTIVE
  },
  {
    label: "finished voting",
    value: PROPOSAL_VOTING_FINISHED
  },
  {
    label: "all proposals",
    value: PROPOSAL_FILTER_ALL
  }
];
const userFilterOptions = [
  {
    label: "submitted",
    value: PROPOSAL_USER_FILTER_SUBMITTED
  },
  {
    label: "drafts",
    value: PROPOSAL_USER_FILTER_DRAFT
  }
];
const mapHeaderToOptions = {
  [LIST_HEADER_UNVETTED]: adminFilterOptions,
  [LIST_HEADER_PUBLIC]: publicFilterOptions,
  [LIST_HEADER_USER]: userFilterOptions
};

const mapHeaderToCount = {
  [LIST_HEADER_UNVETTED]: (proposalCounts, status) => {
    // unreviewed proposals and proposals with unreviewed changes are shown on the same list
    // so is necessary to sum their counts
    const count = proposalCounts[status] || 0;
    if(status === PROPOSAL_STATUS_UNREVIEWED) {
      return count + (proposalCounts[PROPOSAL_STATUS_UNREVIEWED_CHANGES] || 0);
    }
    return count;
  },
  [LIST_HEADER_PUBLIC]: (proposalCounts, status) => {
    // voting not authorized and voting authorized proposals are shown on the same list
    // so is necessary to sum their counts
    const count = proposalCounts[status] || 0;
    if(status === PROPOSAL_VOTING_NOT_AUTHORIZED) {
      return count + (proposalCounts[PROPOSAL_VOTING_AUTHORIZED] || 0);
    }
    return count;
  },
  [LIST_HEADER_USER]: (proposalCounts, status) => proposalCounts[status] || 0
};

const ProposalFilter = ({ handleChangeFilterValue, header, filterValue, proposalCounts }) => (
  mapHeaderToOptions[header] ?
    <Tabs>
      {mapHeaderToOptions[header].map((op) => (
        <Tab
          key={op.value}
          title={op.label}
          count={mapHeaderToCount[header](proposalCounts, op.value)}
          selected={filterValue === op.value}
          onTabChange={() => handleChangeFilterValue(op.value)} />
      ))}
    </Tabs>
    : null
);

export default ProposalFilter;
