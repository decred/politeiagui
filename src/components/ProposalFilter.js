import React from "react";
import {
  PROPOSAL_FILTER_ALL,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_DRAFT,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_NOT_STARTED,
  PROPOSAL_VOTING_FINISHED,
  LIST_HEADER_PUBLIC,
  LIST_HEADER_UNVETTED
} from "../constants";

const adminFilterOptions = [
  {
    label: "only unreviewed",
    value: PROPOSAL_STATUS_UNREVIEWED
  },
  {
    label: "only censored",
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
    label: "saved as draft",
    value: PROPOSAL_STATUS_DRAFT
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
    <div style={{ display: "flex", margin: "16px 0px 0 24px", flexWrap: "wrap", alignItems: "center" }}>
      <span style={{marginRight: "16px"}}>Show:</span>
      {mapHeaderToOptions[header].map((op, idx) => (
        <div key={op.value}>
          <input
            type="radio"
            key={`radio-option-${idx}`}
            id={`proposal-filter-${op.value}`}
            name="proposals-filter"
            style={{ cursor: "pointer" }}
            value={op.value}
            checked={filterValue === op.value}
            onChange={e => handleChangeFilterValue(e.target.value)} />
          <label
            for={`proposal-filter-${op.value}`}
            style={{ margin: "0 16px 0 4px", cursor: "pointer" }}>
            <span className="proposal-filter-label">{op.label}</span>{" "}
            <span className="proposal-filter-count">{`(${proposalCounts[op.value] || 0})`}</span>
          </label>
        </div>
      ))}
    </div>
    : null
);

export default ProposalFilter;
