import React from "react";
import { Link } from "react-router-dom";

const ProposalSummary = ({
  proposal: {
    name,
    timestamp,
    censorshiprecord: {
      token
    }
  }
}) => (
  <div className="proposal-summary">
    <h3><Link to={`/proposals/${token}`}>{name}</Link></h3>
    <div>
      Created {(new Date(timestamp * 1000)).toString()}
    </div>
  </div>
);

export default ProposalSummary;
