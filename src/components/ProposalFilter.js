import React from "react";
import {
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_CENSORED,
} from "../constants";

const ProposalFilter = ({handleChangeFilterValue, header, filterValue}) => (
  header === "Unvetted Proposals" ?
    <div style={{margin: "16px 352px 0 24px"}}>
      <span style={{marginRight: "16px"}}>Show:</span>

      <input
        type="radio"
        id="admin-proposals-filter-unreviewed"
        name="admin-proposals-filter"
        value={PROPOSAL_STATUS_UNREVIEWED}
        checked={filterValue === PROPOSAL_STATUS_UNREVIEWED}
        onChange={e => handleChangeFilterValue(e.target.value)} />
      <label
        for="admin-proposals-filter-unreviewed"
        style={{margin: "0 16px 0 4px"}}>
        Only unreviewed
      </label>

      <input
        type="radio"
        id="admin-proposals-filter-censored"
        name="admin-proposals-filter"
        value={PROPOSAL_STATUS_CENSORED}
        checked={filterValue === PROPOSAL_STATUS_CENSORED}
        onChange={e => handleChangeFilterValue(e.target.value)} />
      <label
        for="admin-proposals-filter-censored"
        style={{margin: "0 16px 0 4px"}}>
        Only censored
      </label>

      <input
        type="radio"
        id="admin-proposals-filter-all"
        name="admin-proposals-filter"
        value={0}
        checked={filterValue === 0}
        onChange={e => handleChangeFilterValue(e.target.value)} />
      <label
        for="admin-proposals-filter-all"
        style={{margin: "0 16px 0 4px"}}>
        All
      </label>
    </div>
    : null
);

export default ProposalFilter;
