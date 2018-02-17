import React from "react";
import {
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_CENSORED,
} from "../constants";

const ProposalFilter = ({handleChangeFilterValue, header, filterValue}) => (
  header === "Unvetted Proposals" ?
    <div style={{margin: "16px 352px 0 24px"}}>
      <span style={{margin: "5px"}}>Show:</span>
      <select
        value={filterValue}
        onChange={(e) => handleChangeFilterValue(e.target.value)}
      >
        <option value={PROPOSAL_STATUS_UNREVIEWED}>Only Unreviewed</option>
        <option value={PROPOSAL_STATUS_CENSORED}>Only Censored</option>
        <option value={0}>All</option>
      </select>
    </div>
    : null
);

export default ProposalFilter;
