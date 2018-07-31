import React from "react";
import { Tabs, Tab } from "./Tabs";
import {
  PROPOSAL_FILTER_ALL,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_NOT_STARTED,
  PROPOSAL_VOTING_FINISHED,
  LIST_HEADER_PUBLIC,
  LIST_HEADER_UNVETTED
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
    label: "all",
    value: PROPOSAL_FILTER_ALL
  }
];
const publicFilterOptions = [
  {
    label: "pre-voting",
    value: PROPOSAL_VOTING_NOT_STARTED
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
const mapHeaderToOptions = {
  [LIST_HEADER_UNVETTED]: adminFilterOptions,
  [LIST_HEADER_PUBLIC]: publicFilterOptions
};

const ProposalFilter = ({ handleChangeFilterValue, header, filterValue, proposalCounts }) => (
  mapHeaderToOptions[header] ?
    <Tabs>
      {mapHeaderToOptions[header].map((op) => (
        <Tab
          key={op.value}
          title={op.label}
          count={proposalCounts[op.value] || 0}
          selected={filterValue === op.value}
          onTabChange={() => handleChangeFilterValue(op.value)} />
      ))}
    </Tabs>
    : null
);

export default ProposalFilter;
