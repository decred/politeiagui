import React from "react";
import {
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_NOT_STARTED,
  PROPOSAL_VOTING_FINISHED
} from "../constants";

const adminFilterOptions = [
  {
    label: "Only unreviewed",
    value: PROPOSAL_STATUS_UNREVIEWED
  },
  {
    label: "Only censored",
    value: PROPOSAL_STATUS_CENSORED
  },
  {
    label: "All",
    value: 0
  }
];
const publicFilterOptions = [
  {
    label: "Only voting active",
    value: PROPOSAL_VOTING_ACTIVE
  },
  {
    label: "Only voting not started",
    value: PROPOSAL_VOTING_NOT_STARTED
  },
  {
    label: "Only voting finished",
    value: PROPOSAL_VOTING_FINISHED
  },
  {
    label: "All",
    value: 0
  }
];
const mapHeaderToOptions = {
  ["Unvetted Proposals"]: adminFilterOptions,
  ["Active Proposals"]: publicFilterOptions
};

const ProposalFilter = ({ handleChangeFilterValue, header, filterValue }) => (
  mapHeaderToOptions[header] ?
    <div style={{ display: "flex", margin: "16px 0px 0 24px", flexWrap: "wrap" }}>
      <span style={{marginRight: "16px"}}>Show:</span>
      {mapHeaderToOptions[header].map((op, idx) => (
        <div>
          <input
            type="radio"
            key={`radio-option-${idx}`}
            id={`proposal-filter-${op.value}`}
            name="proposals-filter"
            value={op.value}
            checked={filterValue === op.value}
            onChange={e => handleChangeFilterValue(e.target.value)} />
          <label
            for="admin-proposals-filter-unreviewed"
            style={{margin: "0 16px 0 4px"}}>
            {op.label}
          </label>
        </div>
      ))}
    </div>
    : null
);

export default ProposalFilter;
